import { describe, expect, it } from '@jest/globals';
import { Grid } from './grid';

describe('grid', () => {
  const grid = new Grid<string>([
    ['0,0', '0,1', '0,2', '0,3', '0,4'],
    ['1,0', '1,1', '1,2', '1,3', '1,4'],
    ['2,0', '2,1', '2,2', '2,3', '2,4'],
    ['3,0', '3,1', '3,2', '3,3', '3,4'],
    ['4,0', '4,1', '4,2', '4,3', '4,4'],
  ]);
  describe('getNeighbours', () => {
    it('returns all adjacent points', () => {
      const r = grid.getNeighbours({ x: 2, y: 2 });
      expect(r).toHaveLength(4);
      expect(r).toEqual(
        expect.arrayContaining([
          { x: 1, y: 2 },
          { x: 3, y: 2 },
          { x: 2, y: 1 },
          { x: 2, y: 3 },
        ])
      );
    });

    it.each([
      ['top', { x: 2, y: 0 }],
      ['bottom', { x: 2, y: 4 }],
      ['left', { x: 0, y: 2 }],
      ['right', { x: 4, y: 2 }],
    ])('works for edges %s', (name, point) => {
      expect(grid.getNeighbours(point)).toHaveLength(3);
    });
  });

  describe('get', () => {
    it('returns the right value', () => {
      for (let x = 0; x <= 4; x++) {
        for (let y = 0; y <= 4; y++) {
          expect(grid.get({ x, y })).toBe(`${y},${x}`);
        }
      }
    });

    it.each([
      { x: -1, y: 2 },
      { x: 2, y: -1 },
      { x: 20, y: 2 },
      { x: 2, y: 20 },
    ])('throw when out of bounds: $p.x, %p.y', (p) => {
      expect(() => grid.get(p)).toThrow('out of bounds');
    });
  });
});
