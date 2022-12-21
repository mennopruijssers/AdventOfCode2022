import { BaseDay } from '../day';

type Valve = {
  name: string;
  flowRate: number;
  connected: string[];
};

type State = {
  openValves: Set<string>;
  currentPosition: string;
  cameFrom: string;
  timeLeft: number;
  pressureReleased: number;
};

export class Day extends BaseDay<Record<string, Valve>, number, number> {
  parse(input: string): Record<string, Valve> {
    return input
      .split('\n')
      .map((line) => {
        const match =
          /Valve (\w+) has flow rate=(\d+); tunnel(s)? lead(s)? to valve(s)? (.+)$/.exec(
            line
          );
        // istanbul ignore next
        if (!match) throw new Error('invalid line: ' + line);
        const name = match[1];
        const flowRate = parseInt(match[2]);
        const connected = match[6].split(', ');
        return { name, flowRate, connected };
      })
      .reduce((map, valve) => ({ ...map, [valve.name]: valve }), {});
  }

  async partOne(): Promise<number> {
    const valves = this.input;
    // generate all possible options:

    const timeLeft = 30;
    const queue: State[] = [
      {
        cameFrom: 'AA',
        currentPosition: 'AA',
        openValves: new Set(),
        timeLeft,
        pressureReleased: 0,
      },
    ];

    const totalReleasablePressure = Object.values(valves)
      .map((v) => v.flowRate)
      .reduce((sum, cur) => sum + cur, 0);
    let state: State | undefined;
    let bestOption = 0;
    while ((state = queue.pop())) {
      const { openValves, cameFrom, currentPosition } = state;
      let { timeLeft, pressureReleased } = state;
      if (timeLeft === 0) {
        if (pressureReleased > bestOption) {
          bestOption = pressureReleased;
        }
        continue;
      }
      const potentialMax =
        pressureReleased + timeLeft * totalReleasablePressure;
      if (potentialMax <= bestOption) {
        continue;
      }

      timeLeft--;
      pressureReleased += [...openValves]
        .map((n) => valves[n].flowRate)
        .reduce((sum, cur) => sum + cur, 0);

      const currentValve = valves[currentPosition];
      const options = currentValve.connected
        .filter((v) => v !== cameFrom)
        .map((v) => ({
          timeLeft,
          pressureReleased,
          openValves: openValves,
          cameFrom: currentPosition,
          currentPosition: v,
        }));
      if (
        !openValves.has(currentPosition) &&
        cameFrom !== currentPosition &&
        currentValve.flowRate > 0
      ) {
        options.push({
          timeLeft,
          pressureReleased,
          openValves: new Set([...openValves, currentPosition]),
          cameFrom: currentPosition,
          currentPosition: currentPosition,
        });
      }
      queue.push(...options);
    }

    return bestOption;
  }

  async partTwo(): Promise<number> {
    function buildCostMap(
      valves: Record<string, Valve>
    ): [Record<string, Record<string, number>>, string[]] {
      const costMap: Record<string, Record<string, number>> = {};
      const valvesWithFlow = Object.entries(valves)
        .filter(([_, valve]) => valve.flowRate > 0)
        .map(([name, _]) => name);

      for (const name of [...valvesWithFlow, 'AA']) {
        const queue = [name];
        const distanceMap: Record<string, number> = { [name]: 0 };
        const visited = new Set([name]);
        let current;
        while ((current = queue.shift())) {
          const valve = valves[current];
          for (const next of valve.connected) {
            if (visited.has(next)) continue;
            visited.add(next);
            distanceMap[next] = distanceMap[current] + 1;
            queue.push(next);
          }
        }
        costMap[name] = distanceMap;
      }
      return [costMap, valvesWithFlow.sort()];
    }

    const valves = this.input;
    const [costMap, valvesWithFlow] = buildCostMap(valves);

    const bestFlowMap: Record<string, number> = {};

    function recordPath(
      currentValve: string,
      time: number,
      path: string[],
      pathFlow: number
    ) {
      const nextValves = valvesWithFlow.filter((n) => !path.includes(n));
      for (const nextValve of nextValves) {
        const timeLeft = time - costMap[currentValve][nextValve] - 1;
        if (timeLeft <= 0) continue;

        const flow = valves[nextValve].flowRate * timeLeft;
        recordPath(nextValve, timeLeft, [...path, nextValve], flow + pathFlow);
      }
      const pathKey = path.sort().join('');
      bestFlowMap[pathKey] = Math.max(pathFlow, bestFlowMap[pathKey] || 0);
    }
    recordPath('AA', 26, [], 0);

    function extendBestFlowMap(options: string[]) {
      const pathKey = options.join('');
      //istanbul ignore next: not covered by test
      if (bestFlowMap[pathKey] === undefined) {
        const bestFlow = options.reduce((max, option) => {
          const result = extendBestFlowMap(options.filter((o) => o != option));
          return Math.max(max, result);
        }, 0);
        bestFlowMap[pathKey] = bestFlow;
      }
      return bestFlowMap[pathKey];
    }
    extendBestFlowMap(valvesWithFlow);

    let p2 = 0;
    for (const position1 of Object.keys(bestFlowMap)) {
      const position2 = valvesWithFlow.reduce(
        (k, v) => (position1.includes(v) ? k : k + v),
        ''
      );
      p2 = Math.max(p2, bestFlowMap[position1] + bestFlowMap[position2]);
    }
    return p2;
  }
}

export default Day;
