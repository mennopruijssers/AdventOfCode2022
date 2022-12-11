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

class Monkey {
  index: number;
  items: number[];
  operation: (input: number) => number;
  divisibleBy: number;
  toIfTrue: number;
  toIfFalse: number;
  totalInspected = 0;

  constructor(
    index: number,
    items: number[],
    operation: Monkey['operation'],
    divisibleBy: number,
    toIfTrue: number,
    toIfFalse: number
  ) {
    this.index = index;
    this.items = items;
    this.operation = operation;
    this.divisibleBy = divisibleBy;
    this.toIfTrue = toIfTrue;
    this.toIfFalse = toIfFalse;
  }

  round(monkeys: Monkey[], division: number, mod?: number): void {
    let item: number | undefined;
    while ((item = this.items.shift())) {
      this.totalInspected++;
      item = this.operation(item);
      if (division !== 1) {
        item = Math.floor(item / division);
      }
      if (mod) {
        item = item % mod;
      }
      const to = item % this.divisibleBy === 0 ? this.toIfTrue : this.toIfFalse;
      monkeys[to].items.push(item);
    }
  }

  clone(): Monkey {
    return new Monkey(
      this.index,
      [...this.items],
      this.operation,
      this.divisibleBy,
      this.toIfTrue,
      this.toIfFalse
    );
  }

  static parse(input: string[]): Monkey {
    const indexMatch = input[0].match(/Monkey (\d+):/);
    assert(indexMatch);
    const index = parseInt(indexMatch[1]);

    assert(input[1].match(/ {2}Starting items: (\d+, )*\d+/));
    const items = input[1]
      .substring('  Starting items: '.length)
      .trim()
      .split(', ')
      .map((s) => parseInt(s));

    const operation = parseOperation(input[2]);
    const divisibleByMatch = input[3].match(/^ {2}Test: divisible by (\d+)$/);
    assert(divisibleByMatch);

    const divisibleBy = parseInt(divisibleByMatch[1]);

    const ifTrueMatch = input[4].match(/If true: throw to monkey (\d+)/);
    assert(ifTrueMatch);
    const toIfTrue = parseInt(ifTrueMatch[1]);

    const ifFalseMatch = input[5].match(/If false: throw to monkey (\d+)/);
    assert(ifFalseMatch);
    const toIfFalse = parseInt(ifFalseMatch[1]);

    return new Monkey(
      index,
      items,
      operation,
      divisibleBy,
      toIfTrue,
      toIfFalse
    );
  }
}

export class Day extends BaseDay<Monkey[], number, number> {
  parse(input: string): Monkey[] {
    const chunks = createChunks(input.split('\n'), 7);
    return chunks.map((input) => Monkey.parse(input));
  }

  async partOne(): Promise<number> {
    const monkeys = this.input.map((m) => m.clone());
    for (let round = 0; round < 20; round++) {
      monkeys.forEach((m) => m.round(monkeys, 3));
    }
    const inspections = monkeys
      .map(({ totalInspected }) => totalInspected)
      .sort((a, b) => b - a);
    return inspections[0] * inspections[1];
  }

  async partTwo(): Promise<number> {
    const monkeys = this.input.map((m) => m.clone());
    const mod = monkeys
      .map(({ divisibleBy }) => divisibleBy)
      .reduce((product, cur) => cur * product, 1);
    for (let round = 1; round <= 10000; round++) {
      monkeys.forEach((m) => m.round(monkeys, 1, mod));
    }
    const inspections = monkeys
      .map(({ totalInspected }) => totalInspected)
      .sort((a, b) => b - a);
    return inspections[0] * inspections[1];
  }
}

export default Day;
