import { notEmpty } from './predicates';
import { Point } from './types';

export type Cell<T> = {
  point: Point;
  value: T;
};

export class Grid<T> {
  public grid: T[][];
  constructor(grid: T[][]) {
    this.grid = grid;
  }

  getNeighbours(p: Point): Point[] {
    const adjacent: Point[] = [
      [-1, 0],
      [0, -1],
      [1, 0],
      [0, 1],
    ].map(([difX, difY]) => ({ x: p.x + difX, y: p.y + difY }));

    return adjacent
      .map((point) => {
        const { x, y } = point;
        if (y < 0 || y >= this.grid.length) {
          return undefined;
        }
        if (x < 0 || x >= this.grid[y].length) {
          return undefined;
        }
        return point;
      })
      .filter(notEmpty);
  }

  get({ x, y }: Point): T {
    if (y < 0 || y > this.grid.length) {
      throw new Error('out of bounds');
    }
    const line = this.grid[y];
    if (x < 0 || x > line.length) {
      throw new Error('out of bounds');
    }

    return line[x];
  }
  getOrDefault({ x, y }: Point, def: T): T {
    if (y < 0 || y > this.grid.length) {
      return def;
    }
    const line = this.grid[y];
    if (x < 0 || x > line.length) {
      return def;
    }

    return line[x];
  }
}
