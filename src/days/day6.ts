import { BaseDay } from '../day';

function findMarker(input: string, length: number): number {
  for (let i = length; i < input.length; i++) {
    const chars = [...input.substring(i - length, i)];
    const set = new Set(chars);
    if (set.size === length) {
      return i;
    }
  }
  /* istanbul ignore next */
  return -1;
}

export class Day extends BaseDay<string, number, number> {
  parse(input: string): string {
    return input;
  }
  async partOne(): Promise<number> {
    return findMarker(this.input, 4);
  }
  async partTwo(): Promise<number> {
    return findMarker(this.input, 14);
  }
}

export default Day;
