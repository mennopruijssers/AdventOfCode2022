import { describe, expect, it } from '@jest/globals';
import Day, {
  move,
  parseGrid,
  parseInstructions,
  PointWithDirection,
  rotate,
} from './day-22';
import { dayRunner } from './test-util';

const example = `
        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`;

it('parses instructions', () => {
  const L = 'L';
  const R = 'R';
  expect(parseInstructions('10R5L5R10L4R5L5')).toStrictEqual([
    10,
    R,
    5,
    L,
    5,
    R,
    10,
    L,
    4,
    R,
    5,
    L,
    5,
  ]);
});

it('parses grid', () => {
  const grid = parseGrid('  ..##\n..## .');
  expect(grid.get({ x: 0, y: 0 })).toStrictEqual(' ');
  expect(grid.get({ x: 5, y: 1 })).toStrictEqual('.');
});

describe('rotate', () => {
  it('rotates L', () => {
    const current: PointWithDirection = { x: 1, y: 1, direction: 2 };
    expect(rotate({ rotate: 'L', current }).direction).toStrictEqual(1);
  });

  it('rotates R', () => {
    const current: PointWithDirection = { x: 1, y: 1, direction: 2 };
    expect(rotate({ rotate: 'R', current }).direction).toStrictEqual(3);
  });

  it('wraps L', () => {
    const current: PointWithDirection = { x: 1, y: 1, direction: 0 };
    expect(rotate({ rotate: 'L', current }).direction).toStrictEqual(3);
  });

  it('wraps R', () => {
    const current: PointWithDirection = { x: 1, y: 1, direction: 3 };
    expect(rotate({ rotate: 'R', current }).direction).toStrictEqual(0);
  });
});

describe('move', () => {
  const grid = parseGrid('.....\n.....\n.....\n.....');

  it('moves up', () => {
    const next = move({ move: 2, current: { x: 2, y: 2, direction: 3 }, grid });
    expect(next).toEqual({ x: 2, y: 0, direction: 3 });
  });

  it('moves up and wraps', () => {
    const next = move({ move: 2, current: { x: 2, y: 1, direction: 3 }, grid });
    expect(next).toEqual({ x: 2, y: 3, direction: 3 });
  });

  it('moves down', () => {
    const next = move({ move: 2, current: { x: 2, y: 0, direction: 1 }, grid });
    expect(next).toEqual({ x: 2, y: 2, direction: 1 });
  });

  it('moves down and wraps', () => {
    const next = move({ move: 2, current: { x: 2, y: 2, direction: 1 }, grid });
    expect(next).toEqual({ x: 2, y: 0, direction: 1 });
  });

  it('moves left', () => {
    const next = move({ move: 2, current: { x: 2, y: 2, direction: 2 }, grid });
    expect(next).toEqual({ x: 0, y: 2, direction: 2 });
  });

  it('moves left and wraps', () => {
    const next = move({ move: 2, current: { x: 1, y: 2, direction: 2 }, grid });
    expect(next).toEqual({ x: 4, y: 2, direction: 2 });
  });

  it('moves right', () => {
    const next = move({ move: 2, current: { x: 2, y: 2, direction: 0 }, grid });
    expect(next).toEqual({ x: 4, y: 2, direction: 0 });
  });

  it('moves right and wraps', () => {
    const next = move({ move: 2, current: { x: 4, y: 2, direction: 0 }, grid });
    expect(next).toEqual({ x: 1, y: 2, direction: 0 });
  });
});

dayRunner(Day, example, 6032, 42);
