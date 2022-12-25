import { BaseDay } from '../day';

const MAPPING: Record<string, number> = {
  '=': -2,
  '-': -1,
  '0': 0,
  '1': 1,
  '2': 2,
};

export function snafuToDecimal(string: string): number {
  const length = string.length - 1;
  return [...string]
    .map((c, i) => Math.pow(5, length - i) * MAPPING[c])
    .reduce((sum, acc) => sum + acc, 0);
}

export function decimalToSnafu(number: number): string {
  const snafu = [];

  while (number > 0) {
    const digit = (number + 2) % 5;
    number = Math.floor((number + 2) / 5);
    const entry = Object.entries(MAPPING).find(
      ([_, decimal]) => decimal === digit - 2
    );
    // istanbul ignore next
    if (entry === undefined) throw new Error(`should not happen`);

    snafu.push(entry[0]);
  }
  return snafu.reverse().join('');
}

export class Day extends BaseDay<number[], string, number> {
  parse(input: string): number[] {
    return input.split('\n').map((s) => snafuToDecimal(s));
  }

  async partOne(): Promise<string> {
    const sum = this.input.reduce((sum, acc) => sum + acc, 0);
    return decimalToSnafu(sum);
  }

  // istanbul ignore next: no part 2
  async partTwo(): Promise<number> {
    return 42;
  }
}

export default Day;
