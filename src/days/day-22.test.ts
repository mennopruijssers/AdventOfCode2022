import { describe, expect, it } from '@jest/globals';
import Day, {
  move,
  parseGrid,
  parseInstructions,
  PointWithDirection,
  rotate,
  wrapCube,
  wrapDefault,
} from './day-22';
import { dayRunner } from './test-util';
import * as fs from 'fs/promises';

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
  describe('default wrapping', () => {
    const grid = parseGrid('.....\n.....\n.....\n.....');
    const wrap = wrapDefault;
    it('moves up', () => {
      const next = move({
        move: 2,
        current: { x: 2, y: 2, direction: 3 },
        grid,
        wrap,
      });
      expect(next).toEqual({ x: 2, y: 0, direction: 3 });
    });

    it('moves up and wraps - default', () => {
      const next = move({
        move: 2,
        current: { x: 2, y: 1, direction: 3 },
        grid,
        wrap,
      });
      expect(next).toEqual({ x: 2, y: 3, direction: 3 });
    });

    it('moves down', () => {
      const next = move({
        move: 2,
        current: { x: 2, y: 0, direction: 1 },
        grid,
        wrap,
      });
      expect(next).toEqual({ x: 2, y: 2, direction: 1 });
    });

    it('moves down and wraps', () => {
      const next = move({
        move: 2,
        current: { x: 2, y: 2, direction: 1 },
        grid,
        wrap,
      });
      expect(next).toEqual({ x: 2, y: 0, direction: 1 });
    });

    it('moves left', () => {
      const next = move({
        move: 2,
        current: { x: 2, y: 2, direction: 2 },
        grid,
        wrap,
      });
      expect(next).toEqual({ x: 0, y: 2, direction: 2 });
    });

    it('moves left and wraps', () => {
      const next = move({
        move: 2,
        current: { x: 1, y: 2, direction: 2 },
        grid,
        wrap,
      });
      expect(next).toEqual({ x: 4, y: 2, direction: 2 });
    });

    it('moves right', () => {
      const next = move({
        move: 2,
        current: { x: 2, y: 2, direction: 0 },
        grid,
        wrap,
      });
      expect(next).toEqual({ x: 4, y: 2, direction: 0 });
    });

    it('moves right and wraps', () => {
      const next = move({
        move: 2,
        current: { x: 4, y: 2, direction: 0 },
        grid,
        wrap,
      });
      expect(next).toEqual({ x: 1, y: 2, direction: 0 });
    });
  });
});

dayRunner(Day, example, 6032);

describe('wrapCube', () => {
  describe('right', () => {
    const direction = 0;
    it('Right -> bottom', () => {
      expect(wrapCube({ x: 149, y: 0, direction })).toStrictEqual({
        x: 99,
        y: 149,
        direction: 2,
      });
      expect(wrapCube({ x: 149, y: 1, direction })).toStrictEqual({
        x: 99,
        y: 148,
        direction: 2,
      });
      expect(wrapCube({ x: 149, y: 48, direction })).toStrictEqual({
        x: 99,
        y: 101,
        direction: 2,
      });
      expect(wrapCube({ x: 149, y: 49, direction })).toStrictEqual({
        x: 99,
        y: 100,
        direction: 2,
      });
    });

    it('front -> right', () => {
      expect(wrapCube({ x: 99, y: 50, direction })).toStrictEqual({
        x: 100,
        y: 49,
        direction: 3,
      });
      expect(wrapCube({ x: 99, y: 51, direction })).toStrictEqual({
        x: 101,
        y: 49,
        direction: 3,
      });
      expect(wrapCube({ x: 99, y: 98, direction })).toStrictEqual({
        x: 148,
        y: 49,
        direction: 3,
      });
      expect(wrapCube({ x: 99, y: 99, direction })).toStrictEqual({
        x: 149,
        y: 49,
        direction: 3,
      });
    });

    it('bottom -> right', () => {
      expect(wrapCube({ x: 99, y: 100, direction })).toStrictEqual({
        x: 149,
        y: 49,
        direction: 2,
      });
      expect(wrapCube({ x: 99, y: 101, direction })).toStrictEqual({
        x: 149,
        y: 48,
        direction: 2,
      });
      expect(wrapCube({ x: 99, y: 148, direction })).toStrictEqual({
        x: 149,
        y: 1,
        direction: 2,
      });
      expect(wrapCube({ x: 99, y: 149, direction })).toStrictEqual({
        x: 149,
        y: 0,
        direction: 2,
      });
    });

    it('Back -> bottom', () => {
      expect(wrapCube({ x: 49, y: 150, direction })).toStrictEqual({
        x: 50,
        y: 149,
        direction: 3,
      });
      expect(wrapCube({ x: 49, y: 151, direction })).toStrictEqual({
        x: 51,
        y: 149,
        direction: 3,
      });
      expect(wrapCube({ x: 49, y: 198, direction })).toStrictEqual({
        x: 98,
        y: 149,
        direction: 3,
      });
      expect(wrapCube({ x: 49, y: 199, direction })).toStrictEqual({
        x: 99,
        y: 149,
        direction: 3,
      });
    });
  });

  describe('left', () => {
    const direction = 2;
    it('top -> left', () => {
      expect(wrapCube({ x: 50, y: 0, direction })).toStrictEqual({
        x: 0,
        y: 149,
        direction: 0,
      });
      expect(wrapCube({ x: 50, y: 1, direction })).toStrictEqual({
        x: 0,
        y: 148,
        direction: 0,
      });
      expect(wrapCube({ x: 50, y: 48, direction })).toStrictEqual({
        x: 0,
        y: 101,
        direction: 0,
      });
      expect(wrapCube({ x: 50, y: 49, direction })).toStrictEqual({
        x: 0,
        y: 100,
        direction: 0,
      });
    });

    it('front -> left', () => {
      expect(wrapCube({ x: 50, y: 50, direction })).toStrictEqual({
        x: 0,
        y: 100,
        direction: 1,
      });
      expect(wrapCube({ x: 50, y: 51, direction })).toStrictEqual({
        x: 1,
        y: 100,
        direction: 1,
      });
      expect(wrapCube({ x: 50, y: 98, direction })).toStrictEqual({
        x: 48,
        y: 100,
        direction: 1,
      });
      expect(wrapCube({ x: 50, y: 99, direction })).toStrictEqual({
        x: 49,
        y: 100,
        direction: 1,
      });
    });

    it('left -> top', () => {
      expect(wrapCube({ x: 0, y: 100, direction })).toStrictEqual({
        x: 50,
        y: 49,
        direction: 0,
      });
      expect(wrapCube({ x: 0, y: 101, direction })).toStrictEqual({
        x: 50,
        y: 48,
        direction: 0,
      });
      expect(wrapCube({ x: 0, y: 148, direction })).toStrictEqual({
        x: 50,
        y: 1,
        direction: 0,
      });
      expect(wrapCube({ x: 0, y: 149, direction })).toStrictEqual({
        x: 50,
        y: 0,
        direction: 0,
      });
    });

    it('back -> top', () => {
      expect(wrapCube({ x: 0, y: 150, direction })).toStrictEqual({
        x: 50,
        y: 0,
        direction: 1,
      });
      expect(wrapCube({ x: 0, y: 151, direction })).toStrictEqual({
        x: 51,
        y: 0,
        direction: 1,
      });
      expect(wrapCube({ x: 0, y: 198, direction })).toStrictEqual({
        x: 98,
        y: 0,
        direction: 1,
      });
      expect(wrapCube({ x: 0, y: 199, direction })).toStrictEqual({
        x: 99,
        y: 0,
        direction: 1,
      });
    });
  });

  describe('down', () => {
    const direction = 1;
    it('back -> right', () => {
      expect(wrapCube({ x: 0, y: 199, direction })).toStrictEqual({
        x: 100,
        y: 0,
        direction: 1,
      });
      expect(wrapCube({ x: 1, y: 199, direction })).toStrictEqual({
        x: 101,
        y: 0,
        direction: 1,
      });
      expect(wrapCube({ x: 48, y: 199, direction })).toStrictEqual({
        x: 148,
        y: 0,
        direction: 1,
      });
      expect(wrapCube({ x: 49, y: 199, direction })).toStrictEqual({
        x: 149,
        y: 0,
        direction: 1,
      });
    });

    it('bottom -> back', () => {
      expect(wrapCube({ x: 50, y: 149, direction })).toStrictEqual({
        x: 49,
        y: 150,
        direction: 2,
      });
      expect(wrapCube({ x: 51, y: 149, direction })).toStrictEqual({
        x: 49,
        y: 151,
        direction: 2,
      });
      expect(wrapCube({ x: 98, y: 149, direction })).toStrictEqual({
        x: 49,
        y: 198,
        direction: 2,
      });
      expect(wrapCube({ x: 99, y: 149, direction })).toStrictEqual({
        x: 49,
        y: 199,
        direction: 2,
      });
    });

    it('right -> front', () => {
      expect(wrapCube({ x: 100, y: 49, direction })).toStrictEqual({
        x: 99,
        y: 50,
        direction: 2,
      });
      expect(wrapCube({ x: 101, y: 49, direction })).toStrictEqual({
        x: 99,
        y: 51,
        direction: 2,
      });
      expect(wrapCube({ x: 148, y: 49, direction })).toStrictEqual({
        x: 99,
        y: 98,
        direction: 2,
      });
      expect(wrapCube({ x: 149, y: 49, direction })).toStrictEqual({
        x: 99,
        y: 99,
        direction: 2,
      });
    });
  });

  describe('up', () => {
    const direction = 3;
    it('left -> front', () => {
      expect(wrapCube({ x: 0, y: 100, direction })).toStrictEqual({
        x: 50,
        y: 50,
        direction: 0,
      });
      expect(wrapCube({ x: 1, y: 100, direction })).toStrictEqual({
        x: 50,
        y: 51,
        direction: 0,
      });
      expect(wrapCube({ x: 48, y: 100, direction })).toStrictEqual({
        x: 50,
        y: 98,
        direction: 0,
      });
      expect(wrapCube({ x: 49, y: 100, direction })).toStrictEqual({
        x: 50,
        y: 99,
        direction: 0,
      });
    });

    it('top -> back', () => {
      expect(wrapCube({ x: 50, y: 0, direction })).toStrictEqual({
        x: 0,
        y: 150,
        direction: 0,
      });
      expect(wrapCube({ x: 51, y: 0, direction })).toStrictEqual({
        x: 0,
        y: 151,
        direction: 0,
      });
      expect(wrapCube({ x: 98, y: 0, direction })).toStrictEqual({
        x: 0,
        y: 198,
        direction: 0,
      });
      expect(wrapCube({ x: 99, y: 0, direction })).toStrictEqual({
        x: 0,
        y: 199,
        direction: 0,
      });
    });

    it('right -> back', () => {
      expect(wrapCube({ x: 100, y: 0, direction })).toStrictEqual({
        x: 0,
        y: 199,
        direction: 3,
      });
      expect(wrapCube({ x: 101, y: 0, direction })).toStrictEqual({
        x: 1,
        y: 199,
        direction: 3,
      });
      expect(wrapCube({ x: 148, y: 0, direction })).toStrictEqual({
        x: 48,
        y: 199,
        direction: 3,
      });
      expect(wrapCube({ x: 149, y: 0, direction })).toStrictEqual({
        x: 49,
        y: 199,
        direction: 3,
      });
    });
  });
});

it('part2', async () => {
  const input = await fs.readFile('./inputs/day-22.txt', { encoding: 'utf-8' });
  expect(await new Day(input).partTwo()).toBe(129339);
});
