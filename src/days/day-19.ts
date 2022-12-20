//istanbul ignore file: ignored when SLOW_TEST <> 1
import assert from 'assert';
import { BaseDay } from '../day';

type Mineral = 'ore' | 'clay' | 'obsidian' | 'geode';

type Cost = Partial<Record<Mineral, number>>;
type RobotCost = Partial<Record<Mineral, Cost>>;

type State = {
  stock: Record<Mineral, number>;
  robots: Record<Mineral, number>;
  doNotBuild: Set<Mineral>;
  timeLeft: number;
};

class Blueprint {
  index: number;
  robotCost: RobotCost;
  maxPerRobot: Partial<Record<Mineral, number>>;

  constructor(index: number, robotCost: RobotCost) {
    this.index = index;
    this.robotCost = robotCost;
    this.maxPerRobot = Object.values(robotCost).reduce((map, cost) => {
      (Object.entries(cost) as [Mineral, number][]).forEach(
        ([mineral, amount]) => {
          map[mineral] = Math.max(map[mineral] || 0, amount);
        }
      );
      return map;
    }, {});
  }

  options(state: State): Mineral[] {
    const canBuild = (Object.entries(this.robotCost) as [Mineral, Cost][])
      .filter(([_, cost]) => {
        return (Object.entries(cost) as [Mineral, number][]).every(
          ([mineral, amount]) => state.stock[mineral] >= amount
        );
      })
      .map(([mineral]) => mineral);

    const wantToBuild = canBuild.filter((mineral) => {
      const maxForMineral = this.maxPerRobot[mineral];
      if (maxForMineral === undefined) {
        return true;
      }
      return state.robots[mineral] < maxForMineral;
    });

    if (canBuild.length === 4) {
      // always build geode if possible
      return ['geode'];
    }
    return wantToBuild
      .filter((mineral) => !state.doNotBuild.has(mineral))
      .reverse();
  }

  build(mineral: Mineral, currentState: State): State {
    const cost = this.robotCost[mineral];
    assert(cost);

    const stock = (Object.entries(cost) as [Mineral, number][]).reduce<
      State['stock']
    >(
      (newStock, [mineral, amount]) => ({
        ...newStock,
        [mineral]: newStock[mineral] - amount,
      }),
      { ...currentState.stock }
    );

    return {
      doNotBuild: new Set(),
      robots: {
        ...currentState.robots,
        [mineral]: currentState.robots[mineral] + 1,
      },
      stock,
      timeLeft: currentState.timeLeft,
    };
  }

  collect(state: State): State {
    const stock = (Object.entries(state.robots) as [Mineral, number][]).reduce<
      State['stock']
    >(
      (stock, [mineral, amount]) => ({
        ...stock,
        [mineral]: stock[mineral] + amount,
      }),
      state.stock
    );

    return {
      ...state,
      stock,
      timeLeft: state.timeLeft - 1,
    };
  }

  best(time: number): number {
    const options: State[] = [
      {
        robots: { clay: 0, geode: 0, obsidian: 0, ore: 1 },
        stock: { clay: 0, geode: 0, obsidian: 0, ore: 0 },
        doNotBuild: new Set(),
        timeLeft: time,
      },
    ];
    // const timePerState: Record<string, undefined | Record<string, number>> = {}

    function visitedKey(state: State): string {
      return [
        state.timeLeft,
        ...Object.values(state.robots),
        ...Object.values(state.stock),
        ...state.doNotBuild,
      ].join('-');
    }
    const visited = new Set<string>();
    let state: State | undefined;
    let max: State = {
      doNotBuild: new Set(),
      robots: { clay: 0, geode: 0, obsidian: 0, ore: 0 },
      stock: { clay: 0, geode: 0, obsidian: 0, ore: 0 },
      timeLeft: 0,
    };
    while ((state = options.pop())) {
      if (state.timeLeft === 0) {
        if (state.stock.geode > max.stock.geode) {
          max = state;
        }
        continue;
      }
      const key = visitedKey(state);
      if (visited.has(key)) continue;
      visited.add(key);

      const potentialMax =
        state.stock.geode +
        state.robots.geode * state.timeLeft +
        (state.timeLeft * (state.timeLeft + 1)) / 2;
      if (potentialMax <= max.stock.geode) {
        continue;
      }

      const build = this.options(state);
      const newState = this.collect(state);
      if (build.length !== 4) {
        options.push({ ...newState, doNotBuild: new Set(build) });
      }

      options.push(...build.map((mineral) => this.build(mineral, newState)));
    }

    return max.stock.geode;
  }
}

function parseRobotCosts(input: string): Cost {
  return input
    .split(' and ')
    .map((part) => {
      const [amount, type] = part.split(' ');
      return [type as Mineral, parseInt(amount)];
    })
    .reduce<Cost>(
      (map, [mineral, amount]) => ({
        ...map,
        [mineral]: amount,
      }),
      {}
    );
}
function parseBlueprint(line: string): Blueprint {
  const parts = line.split(':');
  const name = parts[0].match(/Blueprint (\d+)/);
  assert(name, `invalid blueprint: ${line}`);

  const index = parseInt(name[1]);

  const robotCost = parts[1]
    .split('. ')
    .reduce<Blueprint['robotCost']>((map, robotDescription) => {
      const parts = robotDescription
        .trim()
        .match(/Each (\w+) robot costs (.+?)\.?$/);
      assert(parts, `Invalid robot description: ${robotDescription}`);

      const type = parts[1] as Mineral;
      const prices = parseRobotCosts(parts[2]);
      return { ...map, [type]: prices };
    }, {});
  return new Blueprint(index, robotCost);
}

export class Day extends BaseDay<Blueprint[], number, number> {
  parse(input: string): Blueprint[] {
    return input.split('\n').map((line) => parseBlueprint(line));
  }

  async partOne(): Promise<number> {
    const time = 24;

    const results = this.input.map((blueprint) => {
      const geodes = blueprint.best(time);
      return { blueprint, geodes };
    });

    return results
      .map(({ blueprint, geodes }) => blueprint.index * geodes)
      .reduce((sum, cur) => sum + cur, 0);
  }

  async partTwo(): Promise<number> {
    const time = 32;
    const blueprints = this.input.slice(0, 3);
    const results = blueprints.map((blueprint) => {
      const geodes = blueprint.best(time);
      return { blueprint, geodes };
    });

    return results
      .map(({ geodes }) => geodes)
      .reduce((product, cur) => product * cur, 1);
  }
}

export default Day;
