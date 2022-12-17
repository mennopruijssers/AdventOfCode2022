import { BaseDay } from '../day';
import { Point } from '../utils/types';

type Direction = '>' | '<';
type Rock = Point[];

const ROCKS: Rock[] = [
  // ####
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
  ],

  // .#.
  // ###
  // .#.
  [
    { x: 1, y: 2 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 1, y: 0 },
  ],

  // ..#
  // ..#
  // ###
  [
    { x: 2, y: 2 },
    { x: 2, y: 1 },
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ],

  // #
  // #
  // #
  // #
  [
    { x: 0, y: 3 },
    { x: 0, y: 2 },
    { x: 0, y: 1 },
    { x: 0, y: 0 },
  ],

  // ##
  // ##
  [
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 0, y: 0 },
    { x: 1, y: 0 },
  ],
];

function overlaps(
  { rock, point }: { rock: Rock; point: Point },
  grid: boolean[][]
) {
  const overlap = rock
    .map(({ x, y }) => ({ x: x + point.x, y: y + point.y }))
    .some(({ x, y }) => {
      if (y >= grid.length) return false;
      return grid[y][x];
    });

  return overlap;
}

function moveIfPossible(
  { rock, point }: { rock: Rock; point: Point },
  grid: boolean[][],
  direction: Direction
) {
  const newPoint =
    direction === '<'
      ? { x: point.x - 1, y: point.y }
      : { x: point.x + 1, y: point.y };

  if (newPoint.x < 0) return false;
  if (newPoint.x + rock.reduce((maxX, { x }) => Math.max(maxX, x), 0) >= width)
    return false;

  if (overlaps({ rock, point: newPoint }, grid)) {
    return false;
  }

  point.x = newPoint.x;
  return true;
}

function canMoveDown(
  { rock, point }: { rock: Rock; point: Point },
  grid: boolean[][]
) {
  const { x } = point;
  const y = point.y - 1;

  if (y < 0) return false;
  if (y >= grid.length) return true;

  const overlap = rock
    .map((p) => ({ x: p.x + x, y: p.y + y }))
    .some(({ x, y }) => {
      if (y >= grid.length) return false;
      return grid[y][x];
    });

  return !overlap;
}

const DEBUG = process.env['DEBUG'] === '1';

function debug(g: boolean[][], rock?: Rock, point?: Point) {
  /* istanbul ignore else */
  if (!DEBUG) {
    return;
  } else {
    const grid: string[][] = g.map((line) => line.map((b) => (b ? '#' : '.')));
    if (rock && point) {
      rock.forEach(({ x, y }) => {
        const p = { x: point.x + x, y: point.y + y };
        while (p.y >= grid.length) {
          grid.push(new Array(width).fill('.'));
        }

        grid[p.y][p.x] = '@';
      });
    }
    console.log(
      '=======\n' +
        [...grid]
          .reverse()
          .map((l) => l.join(''))
          .join('\n') +
        '\n======='
    );
  }
}

function gridToString(grid: boolean[][]): string {
  return [...grid]
    .reverse()
    .slice(0, 30)
    .map((l) => l.map((b) => (b ? '#' : '.')).join(''))
    .join('\n');
}
const width = 7;

export class Day extends BaseDay<Direction[], number, number> {
  parse(input: string): Direction[] {
    return [...input.trim()] as Direction[];
  }

  async partOne(): Promise<number> {
    const grid: boolean[][] = [];

    const jets = [...this.input];

    let jetIndex = 0;
    for (let i = 0; i < 2022; i++) {
      const rock = ROCKS[i % ROCKS.length];
      const point = { x: 2, y: grid.length + 3 };

      let movedDown;
      do {
        debug(grid, rock, point);
        moveIfPossible({ rock, point }, grid, jets[jetIndex]);
        jetIndex = (jetIndex + 1) % jets.length;
        debug(grid, rock, point);
        movedDown = canMoveDown({ rock, point }, grid);
        if (movedDown) {
          point.y--;
        }
      } while (movedDown);

      rock.forEach(({ x, y }) => {
        const p = { x: point.x + x, y: point.y + y };
        while (p.y >= grid.length) {
          grid.push(new Array(width).fill(false));
        }

        grid[p.y][p.x] = true;
      });
      debug(grid);
    }

    return grid.length;
  }

  async partTwo(): Promise<number> {
    const grid: boolean[][] = [];

    const jets = [...this.input];

    let jetIndex = 0;
    let added = 0;
    const cycles: Record<
      string,
      { i: number; height: number; jetIndex: number; grid: boolean[][] }
    > = {};

    const maxRocks = 1_000_000_000_000;

    for (let i = 0; i < maxRocks; i++) {
      const rockIndex = i % ROCKS.length;

      const rock = ROCKS[rockIndex];
      const point = { x: 2, y: grid.length + 3 };
      let movedDown;
      do {
        debug(grid, rock, point);
        moveIfPossible({ rock, point }, grid, jets[jetIndex]);
        jetIndex = (jetIndex + 1) % jets.length;
        debug(grid, rock, point);
        movedDown = canMoveDown({ rock, point }, grid);
        if (movedDown) {
          point.y--;
        }
      } while (movedDown);

      rock.forEach(({ x, y }) => {
        const p = { x: point.x + x, y: point.y + y };
        while (p.y >= grid.length) {
          grid.push(new Array(width).fill(false));
        }

        grid[p.y][p.x] = true;
      });
      debug(grid);

      const cycleName = `${rockIndex}-${jetIndex}-${gridToString(grid)}`;
      if (cycles[cycleName] && i >= 2022) {
        const state = cycles[cycleName];
        /* istanbul ignore if */
        if (DEBUG) {
          console.log(`cycle detected: ${i}, ${jetIndex}, ${rockIndex}`);
        }
        if (i + state.i < maxRocks) {
          const deltaHeight = grid.length - state.height;
          const deltaI = i - state.i;
          const multiplier = Math.floor((maxRocks - i) / deltaI);
          i += multiplier * deltaI;
          added += multiplier * deltaHeight;
        }
      }
      cycles[cycleName] = {
        jetIndex,
        grid,
        height: grid.length,
        i,
      };
    }
    return grid.length + added;
  }
}

export default Day;
