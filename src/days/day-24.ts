import assert from 'assert';
import { BaseDay } from '../day';
import { Grid } from '../utils/grid';
import { leastCommonMultiple } from '../utils/math';
import { Point } from '../utils/types';

function distance(p1: Point, p2: Point): number {
  return Math.abs(p2.y - p1.y) + Math.abs(p2.x - p1.x);
}

function countNotMoving([{ x, y }, ...points]: Point[]): number {
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (p.x !== x || p.y !== y) {
      return i;
    }
  }
  return points.length;
}

type Empty = null;
type Wall = '#';
type Blizzard = '>' | '<' | 'v' | '^';
type Cell = Wall | Blizzard[] | Empty;

type State = {
  grid: Grid<Cell>;
  path: Point[];
  minutes: number;
};

function isBlizzard(c: string): c is Blizzard {
  return ['>', '<', 'v', '^'].includes(c);
}
function isBlizzardCell(c: Cell): c is Blizzard[] {
  return Array.isArray(c) && c.every((c) => isBlizzard(c));
}

function move(b: Blizzard, { x, y }: Point, grid: Grid<Cell>): Point {
  if (b === '<') {
    if (grid.get({ x: x - 1, y }) === '#') {
      return { x: grid.grid[y].length - 2, y };
    } else {
      return { x: x - 1, y };
    }
  }
  if (b === '>') {
    if (grid.get({ x: x + 1, y }) === '#') {
      return { x: 1, y };
    } else {
      return { x: x + 1, y };
    }
  }
  if (b === '^') {
    if (grid.get({ x, y: y - 1 }) === '#') {
      return { x, y: grid.grid.length - 2 };
    } else {
      return { x, y: y - 1 };
    }
  }
  if (b === 'v') {
    if (grid.get({ x, y: y + 1 }) === '#') {
      return { x, y: 1 };
    } else {
      return { x, y: y + 1 };
    }
  }
  //istanbul ignore next
  throw new Error('invalid blizzard');
}

const tickCache: Grid<Cell>[] = [];
function tick(grid: Grid<Cell>, index: number): Grid<Cell> {
  if (tickCache[index]) {
    return tickCache[index];
  }

  const newGrid: Cell[][] = new Array(grid.grid.length)
    .fill(new Array(grid.grid[0].length))
    .map((a) => new Array(a.length).fill(null));

  grid.grid.forEach((row, y) => {
    return row.forEach((cell, x) => {
      if (isBlizzardCell(cell)) {
        cell.forEach((b) => {
          const { x: nextX, y: nextY } = move(b, { x, y }, grid);
          if (newGrid[nextY][nextX]) {
            (newGrid[nextY][nextX] as Blizzard[]).push(b);
          } else {
            newGrid[nextY][nextX] = [b];
          }
        });
      } else if (cell === '#') {
        assert(newGrid[y][x] === null);
        newGrid[y][x] = cell;
      }
    });
  });
  const tickGrid = new Grid(newGrid);
  tickCache[index] = tickGrid;
  return tickGrid;
}

function findBestPath(
  grid: Grid<Cell>,
  start: Point,
  end: Point,
  minutes = 0
): State {
  const queue: State[] = [{ grid: grid, path: [start], minutes }];
  let current: State | undefined;
  let best: State | undefined;
  const cache: Record<string, number> = {};
  const lcm = leastCommonMultiple(grid.grid.length, grid.grid[0].length);
  while ((current = queue.pop())) {
    const { minutes } = current;
    const path = current.path.slice(0, 3);
    if (best && minutes + distance(path[0], end) >= best.minutes) {
      continue;
    }

    {
      const cacheKey = JSON.stringify({ p: path[0], m: minutes % lcm });
      if (cache[cacheKey] && cache[cacheKey] <= minutes) {
        continue;
      }
      cache[cacheKey] = minutes;
    }

    const { x, y } = path[0];

    if (x === end.x && y === end.y) {
      best = current;
      continue;
    }
    const grid = tick(current.grid, minutes % lcm);
    if (grid.get({ x, y }) === null) {
      // stay max times in one spot
      if (countNotMoving(path) < 3)
        queue.push({ grid, path: [{ x, y }, ...path], minutes: minutes + 1 });
    }
    grid.getNeighbours({ x, y }).forEach((nextP) => {
      if (grid.get(nextP) === null) {
        queue.push({ grid, path: [nextP, ...path], minutes: minutes + 1 });
      }
    });

    queue.sort((p1, p2) => {
      const distance1 = distance(p1.path[0], end);
      const distance2 = distance(p2.path[0], end);
      // Choose closest distance
      if (distance1 != distance2) return distance2 - distance1;

      // prefer moving:
      const notMoving1 = countNotMoving(p1.path);
      const notMoving2 = countNotMoving(p2.path);
      if (notMoving1 !== notMoving2) return notMoving2 - notMoving1;

      return p2.minutes - p1.minutes;
    });
  }

  //istanbul ignore next
  if (!best) throw new Error('no path found');
  return best;
}

export class Day extends BaseDay<Grid<Cell>, State, number> {
  parse(input: string): Grid<Cell> {
    return new Grid(
      input.split('\n').map((l) =>
        [...l].map((c) => {
          if (isBlizzard(c)) return [c];
          if (c === '.') return null;
          if (c === '#') return '#';
          //istanbul ignore next
          throw new Error('invalid input');
        })
      )
    );
  }

  async partOne(): Promise<State> {
    const grid = this.input;
    const start = { x: grid.grid[0].indexOf(null), y: 0 };
    const end = {
      x: grid.grid[grid.grid.length - 1].indexOf(null),
      y: grid.grid.length - 1,
    };

    const best = findBestPath(grid, start, end);

    return best;
  }

  //istanbul ignore next
  printResultOne(output: State): void {
    console.log(output.minutes);
  }

  async partTwo(goal1: State): Promise<number> {
    const grid = goal1.grid;
    const start = { x: grid.grid[0].indexOf(null), y: 0 };
    const end = {
      x: grid.grid[grid.grid.length - 1].indexOf(null),
      y: grid.grid.length - 1,
    };

    const back = findBestPath(goal1.grid, end, start, goal1.minutes);
    const goal2 = findBestPath(back.grid, start, end, back.minutes);
    return goal2.minutes;
  }
}

export default Day;
