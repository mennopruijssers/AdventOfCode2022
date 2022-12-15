import { BaseDay } from '../day';
import { Point } from '../utils/types';

enum Substance {
  Air,
  Rock,
  Sand,
}

class Grid {
  private grid: Record<string, Substance> = {};
  minX: number = Number.MAX_SAFE_INTEGER;
  maxX: number = Number.MIN_SAFE_INTEGER;
  maxY: number = Number.MIN_SAFE_INTEGER;
  ground: number | undefined;

  get(p: Point): Substance {
    const key = JSON.stringify(p);
    if (this.grid[key]) {
      return this.grid[key];
    }
    if (this.ground !== undefined && p.y === this.ground) {
      return Substance.Rock;
    }
    return Substance.Air;
  }

  set(p: Point, s: Substance): boolean {
    if (s === Substance.Rock) {
      this.minX = Math.min(this.minX, p.x);
      this.maxX = Math.max(this.maxX, p.x);
      this.maxY = Math.max(this.maxY, p.y);
    }
    this.grid[JSON.stringify(p)] = s;
    return true;
  }

  // istanbul ignore next : not used
  values(): [Point, Substance][] {
    return Object.entries(this.grid).map(([k, v]) => [
      JSON.parse(k) as Point,
      v,
    ]);
  }

  clone(): Grid {
    const g = new Grid();
    g.grid = { ...this.grid };
    g.maxX = this.maxX;
    g.minX = this.minX;
    g.maxY = this.maxY;
    g.ground = this.ground;
    return g;
  }
}

function flow(grid: Grid): boolean {
  let sand = { x: 500, y: 0 };
  const options = [
    { x: 0, y: 1 },
    { x: -1, y: 1 },
    { x: 1, y: 1 },
  ];
  while (sand.y <= grid.maxY) {
    const next = options
      .map(({ x, y }) => ({ x: x + sand.x, y: y + sand.y }))
      .find((p) => grid.get(p) === Substance.Air);
    if (next) {
      sand = next;
      continue;
    }
    if (grid.get(sand) !== Substance.Air) {
      return false;
    }
    grid.set(sand, Substance.Sand);
    return true;
  }
  return false;
}

export class Day extends BaseDay<Grid, number, number> {
  parse(input: string): Grid {
    const grid = new Grid();

    input.split('\n').forEach((line) => {
      const coordinates: Point[] = line
        .split(' -> ')
        .map((v) => v.split(',').map((s) => parseInt(s)))
        .map(([x, y]) => ({ x, y }));

      const [start, ...rest] = coordinates;
      for (const c of rest) {
        if (c.x === start.x) {
          grid.set(start, Substance.Rock);
          // istanbul ignore next
          const diff = start.y < c.y ? 1 : -1;
          while (start.y !== c.y) {
            start.y += diff;
            grid.set(start, Substance.Rock);
          }
          continue;
        }
        if (c.y === start.y) {
          grid.set(start, Substance.Rock);
          // istanbul ignore next
          const diff = start.x < c.x ? 1 : -1;
          while (start.x !== c.x) {
            start.x += diff;
            grid.set(start, Substance.Rock);
          }
          continue;
        }
        // istanbul ignore next
        throw new Error('not a straight line');
      }
    });

    return grid;
  }

  async partOne(): Promise<number> {
    const grid = this.input.clone();
    let placed;
    do {
      placed = flow(grid);
    } while (placed);

    return grid.values().filter(([_, s]) => s === Substance.Sand).length;
  }

  async partTwo(): Promise<number> {
    const grid = this.input.clone();
    grid.ground = grid.maxY + 2;
    grid.maxY = grid.ground;

    let placed;
    do {
      placed = flow(grid);
    } while (placed);

    return grid.values().filter(([_p, s]) => s === Substance.Sand).length;
  }
}

export default Day;
