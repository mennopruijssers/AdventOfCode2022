import { describe, expect, it } from '@jest/globals';
import Day, { parseOperation } from './day-11';
import { dayRunner } from './test-runner';

const example = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`;

dayRunner(Day, example, 10605, 42);

describe('parseOperation', () => {
  const input = 23;
  it.each([
    ['old + 5', input + 5],
    ['old + old', input + input],
    ['old * 5', input * 5],
    ['old * old', input * input],
  ])(`%s`, (line, expected) => {
    const operation = parseOperation(`Operation: new = ${line}`);
    expect(operation(input)).toBe(expected);
  });
});
