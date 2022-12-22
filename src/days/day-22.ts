import { BaseDay } from '../day';
import { Grid } from '../utils/grid';
import { Point } from '../utils/types';
type Rotate = 'R' | 'L';
type Move = number;
type Instruction = Move | Rotate;

type Cell = ' ' | '.' | '#';
type Input = {
  grid: Grid<Cell>;
  instructions: Instruction[];
};

type Direction =
  | 0 //right
  | 1 //down
  | 2 // left
  | 3; // up

export type PointWithDirection = Point & {
  direction: Direction;
};

function isMove(instruction: Instruction): instruction is Move {
  return typeof instruction === 'number';
}

export function parseInstructions(input: string): Instruction[] {
  const matches = input.matchAll(/(\d+)|([LR])/g);
  const matchesArray = [...matches];
  return matchesArray.map<Instruction>((match) => {
    if (match[1]) {
      return parseInt(match[1], 10);
    } else {
      return match[2] as Rotate;
    }
  });
}

export function parseGrid(input: string): Grid<Cell> {
  const lines = input.split('\n').filter((l) => l !== '');
  const cells: Cell[][] = lines.map((l) => [...l] as Cell[]);

  return new Grid(cells);
}

export function wrapDefault(
  point: PointWithDirection,
  grid: Input['grid']
): PointWithDirection {
  const notEmpty = (c: Cell): boolean => c !== undefined && c != ' ';
  // Right
  if (point.direction === 0) {
    return { ...point, x: grid.grid[point.y].findIndex(notEmpty) };
  }
  // Down
  if (point.direction === 1) {
    return {
      ...point,
      y: grid.grid.map((c) => c[point.x]).findIndex(notEmpty),
    };
  }
  // Left
  if (point.direction === 2) {
    return { ...point, x: grid.grid[point.y].findLastIndex(notEmpty) };
  }
  // Up
  return {
    ...point,
    y: grid.grid.map((c) => c[point.x]).findLastIndex(notEmpty),
  };
}

export function move({
  move,
  current,
  grid,
  wrap,
}: {
  move: Move;
  current: PointWithDirection;
  grid: Input['grid'];
  wrap: (
    current: PointWithDirection,
    grid: Input['grid']
  ) => PointWithDirection;
}): PointWithDirection {
  const axis: keyof Point = [0, 2].includes(current.direction) ? 'x' : 'y';

  const diff = [2, 3].includes(current.direction) ? -1 : 1;

  for (let i = 0; i < move; i++) {
    const next = { ...current };
    const max = axis === 'y' ? grid.grid.length : grid.grid[current.y].length;
    const v = current[axis] + diff;
    if (
      v < 0 ||
      v >= max ||
      grid.getOrDefault({ ...next, [axis]: v }, ' ') === ' '
    ) {
      next[axis] = wrap({ ...current }, grid)[axis];
    } else {
      next[axis] = v;
    }

    if (grid.get(next) === '#') {
      break;
    }
    current = next;
  }

  return current;
}

export function rotate({
  rotate,
  current,
}: {
  rotate: Rotate;
  current: PointWithDirection;
}): PointWithDirection {
  let { direction } = current;
  if (rotate === 'L') {
    direction--;
  } else {
    direction++;
  }
  direction = (((direction % 4) + 4) % 4) as Direction;
  return {
    ...current,
    direction,
  };
}

export class Day extends BaseDay<Input, number, number> {
  parse(input: string): Input {
    const [gridInput, instructionInput] = input.split('\n\n');

    return {
      grid: parseGrid(gridInput),
      instructions: parseInstructions(instructionInput),
    };
  }

  async partOne(): Promise<number> {
    const { grid, instructions } = this.input;

    let current: PointWithDirection = {
      x: grid.grid[0].indexOf('.'),
      y: 0,
      direction: 0,
    };

    for (const instruction of instructions) {
      if (isMove(instruction)) {
        current = move({ current, grid, move: instruction, wrap: wrapDefault });
      } else {
        current = rotate({ current, rotate: instruction });
      }
    }

    return (current.y + 1) * 1000 + (current.x + 1) * 4 + current.direction;
  }

  async partTwo(): Promise<number> {
    return 42;
  }
}

export default Day;
