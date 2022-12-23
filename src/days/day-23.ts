import { BaseDay } from '../day';
import { Point } from '../utils/types';

const DEBUG = process.env['DEBUG'] === '1';

const Moves = {
  N: { x: 0, y: -1 },
  NE: { x: 1, y: -1 },
  E: { x: 1, y: 0 },
  SE: { x: 1, y: 1 },
  S: { x: 0, y: 1 },
  SW: { x: -1, y: 1 },
  W: { x: -1, y: 0 },
  NW: { x: -1, y: -1 },
};
const DIRECTIONS = [
  // NORTH:
  [Moves.N, Moves.NW, Moves.NE],

  // SOUTH:
  [Moves.S, Moves.SW, Moves.SE],

  // WEST:
  [Moves.W, Moves.NW, Moves.SW],

  // EAST:
  [Moves.E, Moves.NE, Moves.SE],
];

type MinMax = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};
function minMax(
  elves: Point[],
  current: MinMax = {
    minX: Number.MAX_SAFE_INTEGER,
    minY: Number.MAX_SAFE_INTEGER,
    maxX: Number.MIN_SAFE_INTEGER,
    maxY: Number.MIN_SAFE_INTEGER,
  }
): MinMax {
  return elves.reduce(
    (acc, p) => ({
      minX: Math.min(p.x, acc.minX),
      minY: Math.min(p.y, acc.minY),
      maxX: Math.max(p.x, acc.maxX),
      maxY: Math.max(p.y, acc.maxY),
    }),
    current
  );
}

function generateKey(p: Point): string {
  return `${p.x},${p.y}`;
}

export class Day extends BaseDay<Point[], number, number> {
  parse(input: string): Point[] {
    const elves: Point[] = [];
    input.split('\n').forEach((l, y) =>
      [...l].forEach((c, x) => {
        if (c === '#') {
          elves.push({ x, y });
        }
      })
    );
    return elves;
  }

  move({ x, y }: Point, taken: Set<string>, round: number): Point {
    const hasToMove = Object.values(Moves)
      .map((p) => ({ x: p.x + x, y: p.y + y }))
      .some((p) => taken.has(generateKey(p)));
    if (!hasToMove) return { x, y };

    const startIndex = round % DIRECTIONS.length;

    for (let i = startIndex; i < startIndex + DIRECTIONS.length; i++) {
      const direction = DIRECTIONS[i % DIRECTIONS.length].map((p) => ({
        x: p.x + x,
        y: p.y + y,
      }));
      if (direction.every((p) => !taken.has(generateKey(p)))) {
        return direction[0];
      }
    }
    return { x, y };
  }

  round(elves: Point[], r: number): Point[] {
    const taken = new Set(elves.map((p) => generateKey(p)));

    //istanbul ignore if
    if (DEBUG) {
      console.log(`ROUND ${r}\n${this.print(elves)}`);
    }

    const result = elves.map((e) => this.move(e, taken, r));
    const resultPointCounts: Record<string, number> = result.reduce<
      Record<string, number>
    >((acc, p) => {
      const key = generateKey(p);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    // const resultPointCounts: Record<string, number> = {};
    // for (const p of result) {
    //   const key = generateKey(p);
    //   resultPointCounts[key] = (resultPointCounts[key] || 0) + 1;
    // }

    return result.map((p, i) => {
      if (resultPointCounts[generateKey(p)] > 1) {
        return elves[i];
      }
      return p;
    });
  }
  rounds(elves: Point[], rounds: number): Point[] {
    for (let r = 0; r < rounds; r++) {
      elves = this.round(elves, r);
    }
    return elves;
  }

  // istanbul ignore next
  print(elves: Point[]): string {
    // istanbul ignore next
    {
      const mm = {
        minX: -3,
        maxX: 10,
        minY: -2,
        maxY: 9,
      };

      const { minX, maxX, minY, maxY } = minMax(elves, mm);

      const set = new Set(elves.map((p) => generateKey(p)));

      const lines = [];
      for (let y = minY; y <= maxY; y++) {
        const line = [];
        for (let x = minX; x <= maxX; x++) {
          if (set.has(generateKey({ x, y }))) {
            line.push('#');
          } else {
            line.push('.');
          }
        }
        lines.push(line.join(''));
      }
      return lines.join('\n');
    }
  }

  async partOne(): Promise<number> {
    const elves = [...this.input];
    const startMinMax = minMax(elves);

    const result = this.rounds(elves, 10);

    const { minX, maxX, minY, maxY } = minMax(result, startMinMax);

    const diffX = maxX - minX + 1;
    const diffY = maxY - minY + 1;
    const totalArea = diffX * diffY;
    return totalArea - elves.length;
  }

  async partTwo(): Promise<number> {
    let elves = [...this.input];
    let moved: boolean;
    let r = 0;
    do {
      const newElves = this.round(elves, r);
      moved = newElves.some(
        ({ x, y }, i) => x !== elves[i].x || y !== elves[i].y
      );
      elves = newElves;
      r++;
    } while (moved);
    return r;
  }
}

export default Day;
