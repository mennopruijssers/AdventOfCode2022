import { BaseDay } from '../day';

interface Monkey {
  result(monkeys: Monkeys): number;
}

type Operation = '+' | '-' | '*' | '/';

class YellMonkey implements Monkey {
  constructor(public value: number) {}

  result(): number {
    return this.value;
  }
}

class MathMonkey implements Monkey {
  constructor(
    public m1: string,
    public operation: Operation,
    public m2: string
  ) {}

  result(monkeys: Monkeys): number {
    const m1 = monkeys[this.m1].result(monkeys);
    const m2 = monkeys[this.m2].result(monkeys);

    switch (this.operation) {
      case '+':
        return m1 + m2;
      case '-':
        return m1 - m2;
      case '*':
        return m1 * m2;
      case '/':
        return m1 / m2;
    }
  }
}

function parseMonkey(input: string): Monkey {
  const parts = input.split(' ');
  if (parts.length === 1) {
    return new YellMonkey(parseInt(parts[0], 10));
  } else {
    return new MathMonkey(parts[0], parts[1] as Operation, parts[2]);
  }
}

type Monkeys = Record<string, Monkey>;

export class Day extends BaseDay<Monkeys, number, number> {
  parse(input: string): Monkeys {
    return input.split('\n').reduce((monkeys, line) => {
      const [name, rest] = line.split(': ');
      const monkey = parseMonkey(rest);
      return {
        ...monkeys,
        [name]: monkey,
      };
    }, {});
  }

  async partOne(): Promise<number> {
    const rootMonkey = this.input['root'];
    return rootMonkey.result(this.input);
  }

  async partTwo(): Promise<number> {
    const monkeys = this.input;
    const rootMonkey = monkeys['root'] as MathMonkey;
    const m1 = monkeys[rootMonkey.m1];
    const m2 = monkeys[rootMonkey.m2];

    const humnMonkey = monkeys['humn'] as YellMonkey;

    function binarySearch(m1: Monkey, m2: Monkey): number | undefined {
      let min = 0;
      let max = 0;

      for (let i = 1; i <= 20; i++) {
        max = Math.pow(10, i);

        humnMonkey.value = max;
        const m1v = m1.result(monkeys);
        const m2v = m2.result(monkeys);

        if (m1v > m2v) {
          break;
        } else {
          min = max;
        }
      }

      while (max - min > 1) {
        const mid = min + Math.floor((max - min) / 2);
        humnMonkey.value = mid;

        const m1v = m1.result(monkeys);
        const m2v = m2.result(monkeys);

        if (m1v === m2v) {
          return mid;
        }

        if (m1v > m2v) {
          max = mid;
        } else {
          min = mid;
        }
      }
      return undefined;
    }

    // search with m1 and m2 reversed to swap the search algorithm.
    let result = binarySearch(m2, m1);

    //istanbul ignore if
    if (result !== undefined) {
      return result;
    }

    result = binarySearch(m1, m2);
    if (result !== undefined) {
      return result;
    }

    // istanbul ignore next
    throw new Error('no result found');
  }
}

export default Day;
