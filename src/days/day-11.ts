import assert from 'assert';
import { BaseDay } from '../day';
import { createChunks } from './utils';

export function parseOperation(string: string): Monkey['operation'] {
  const match = string.match(/Operation: new = old ([*+]) (\d+|old)/);
  assert(match);

  const operation = match[1];
  const operand = match[2];
  if (operation === '+') {
    if (operand === 'old') {
      return (old) => old + old;
    } else {
      const operandNumber = parseInt(operand);
      return (old) => old + operandNumber;
    }
  }
  if (operation === '*') {
    if (operand === 'old') {
      return (old) => old * old;
    } else {
      const operandNumber = parseInt(operand);
      return (old) => old * operandNumber;
    }
  }

  // istanbul ignore next
  throw new Error(`Unsupported operation: ${operation}`);
}

function parseTest(string: string): Monkey['test'] {
  const match = string.match(/Test: divisible by (\d+)/);
  assert(match);

  const divisibleBy = parseInt(match[1]);

  return (input: number) => input % divisibleBy === 0;
}

class Monkey {
  name: string;
  items: number[];
  operation: (input: number) => number;
  test: (input: number) => boolean;
  toIfTrue: number;
  toIfFalse: number;
  totalInspected = 0;

  constructor(
    name: string,
    items: number[],
    operation: Monkey['operation'],
    test: Monkey['test'],
    toIfTrue: number,
    toIfFalse: number
  ) {
    this.name = name;
    this.items = items;
    this.operation = operation;
    this.test = test;
    this.toIfTrue = toIfTrue;
    this.toIfFalse = toIfFalse;
  }

  round(monkeys: Monkey[]): void {
    let item: number | undefined;
    while ((item = this.items.shift())) {
      this.totalInspected++;
      item = this.operation(item);
      item = Math.floor(item / 3);
      const to = this.test(item) ? this.toIfTrue : this.toIfFalse;
      monkeys[to].items.push(item);
    }
  }

  static parse(input: string[]): Monkey {
    assert(input[0].match(/Monkey \d+:/));
    const name = input[0].substring(0, input[0].length - 1);

    assert(input[1].match(/ {2}Starting items: (\d+, )*\d+/));
    const items = input[1]
      .substring('  Starting items: '.length)
      .trim()
      .split(', ')
      .map((s) => parseInt(s));

    const operation = parseOperation(input[2]);
    const test = parseTest(input[3]);

    const ifTrueMatch = input[4].match(/If true: throw to monkey (\d+)/);
    assert(ifTrueMatch);
    const toIfTrue = parseInt(ifTrueMatch[1]);

    const ifFalseMatch = input[5].match(/If false: throw to monkey (\d+)/);
    assert(ifFalseMatch);
    const toIfFalse = parseInt(ifFalseMatch[1]);

    return new Monkey(name, items, operation, test, toIfTrue, toIfFalse);
  }
}

export class Day extends BaseDay<Monkey[], number, number> {
  parse(input: string): Monkey[] {
    const chunks = createChunks(input.split('\n'), 7);
    return chunks.map((input) => Monkey.parse(input));
  }

  async partOne(): Promise<number> {
    const monkeys = this.input;
    for (let round = 0; round < 20; round++) {
      monkeys.forEach((m) => m.round(monkeys));
    }
    const inspections = monkeys
      .map(({ totalInspected }) => totalInspected)
      .sort((a, b) => b - a);
    return inspections[0] * inspections[1];
  }

  async partTwo(): Promise<number> {
    return 42;
  }
}

export default Day;
