import { BaseDay } from '../day';
import { findShortestPath, toEndPoint } from '../utils/pathfinder';
import { Point } from '../utils/types';

type Input = {
  grid: number[][];
  start: Point;
  end: Point;
};

export class Day extends BaseDay<Input, number, number> {
  parse(input: string): Input {
    let start: Point | undefined = undefined;
    let end: Point | undefined = undefined;

    const grid = input.split('\n').map((line, y) => {
      return [...line].map((char, x) => {
        let height;
        if (char === 'S') {
          start = { x, y };
          height = 1;
        } else if (char === 'E') {
          end = { x, y };
          height = 26;
        } else {
          height = char.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
        }
        return height;
      });
    });

    // istanbul ignore next
    if (!start) throw new Error('start not set');
    // istanbul ignore next
    if (!end) throw new Error('end not set');

    return { start, end, grid };
  }

  async partOne(): Promise<number> {
    const path = findShortestPath<number>({
      start: this.input.start,
      grid: this.input.grid,
      isEnd: toEndPoint(this.input.end),
      isAllowed: (from, to) => {
        return to - from <= 1;
      },
    });
    return path.length - 1;
  }

  async partTwo(): Promise<number> {
    const path = findShortestPath<number>({
      start: this.input.end,
      grid: this.input.grid,
      isEnd: ({ value }) => value === 1,
      isAllowed: (from, to) => {
        return from - to <= 1;
      },
    });
    return path.length - 1;
  }
}

export default Day;
