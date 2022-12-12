import { BaseDay } from '../day';
import { Point } from '../utils/types';

enum Direction {
  U,
  R,
  L,
  D,
}

type Move = {
  direction: Direction;
  steps: number;
};

function makeMoves(knots: Point[], dir: Direction): void {
  const head = knots[0];
  switch (dir) {
    case Direction.D:
      head.y -= 1;
      break;
    case Direction.L:
      head.x -= 1;
      break;
    case Direction.R:
      head.x += 1;
      break;
    case Direction.U:
      head.y += 1;
      break;
  }

  for (let i = 1; i < knots.length; i++) {
    const prev = knots[i - 1];
    const cur = knots[i];
    const diffX = prev.x - cur.x;
    const diffY = prev.y - cur.y;
    if (Math.abs(diffX) <= 1 && Math.abs(diffY) <= 1) {
      return;
    }

    cur.y += diffY === 0 ? 0 : diffY > 0 ? 1 : -1;
    cur.x += diffX === 0 ? 0 : diffX > 0 ? 1 : -1;
  }
}

export class Day extends BaseDay<Move[], number, number> {
  parse(input: string): Move[] {
    return input.split('\n').map((line) => {
      const [dir, steps] = line.split(' ');
      return {
        direction: Direction[dir as keyof typeof Direction],
        steps: parseInt(steps, 10),
      };
    });
  }

  async partOne(): Promise<number> {
    const head: Point = { x: 0, y: 0 };
    const tail: Point = { x: 0, y: 0 };

    const visited: Set<string> = new Set();
    for (const { steps, direction } of this.input) {
      for (let i = 0; i < steps; i++) {
        makeMoves([head, tail], direction);
        visited.add(JSON.stringify(tail));
      }
    }
    return visited.size;
  }

  async partTwo(): Promise<number> {
    const knots: Point[] = [];
    for (let i = 0; i < 10; i++) {
      knots.push({ x: 0, y: 0 });
    }

    const visited: Set<string> = new Set();
    for (const { steps, direction } of this.input) {
      for (let i = 0; i < steps; i++) {
        makeMoves(knots, direction);
        visited.add(JSON.stringify(knots[knots.length - 1]));
      }
    }
    return visited.size;
  }
}

export default Day;
