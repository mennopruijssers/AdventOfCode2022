import { describe, expect, it } from '@jest/globals';
import Day, { parseMoves, parseStacks } from './day-05';
import { dayRunner } from './test-util';

const example = `    [D]
[N] [C]
[Z] [M] [P]
  1   2   3

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

describe('parseMoves', () => {
  it('parses', () => {
    const moves = parseMoves(`move 1 from 2 to 1
    move 3 from 1 to 3
    move 2 from 2 to 1
    move 1 from 1 to 2`);

    expect(moves).toHaveLength(4);
    expect(moves[0]).toStrictEqual({ amount: 1, from: 2, to: 1 });
  });
});

describe('parseStacks', () => {
  it('parses', () => {
    const stacks = parseStacks(
      `    [D]
[N] [C]
[Z] [M] [P]
  1   2   3`
    );

    expect(stacks).toHaveLength(3);
    expect(stacks[0]).toStrictEqual(['Z', 'N']);
    expect(stacks[1]).toStrictEqual(['M', 'C', 'D']);
    expect(stacks[2]).toStrictEqual(['P']);
  });
});

dayRunner(Day, example, 'CMZ', 'MCD');
