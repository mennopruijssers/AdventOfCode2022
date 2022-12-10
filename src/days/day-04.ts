import { BaseDay } from '../day';

export class Range {
  from: number;
  to: number;

  constructor(from: number, to: number) {
    this.from = from;
    this.to = to;
  }

  isWithin(other: Range): boolean {
    return other.from <= this.from && other.to >= this.to;
  }

  overlaps(other: Range): boolean {
    if (other.to < this.from) return false;
    if (other.from > this.to) return false;

    return true;
  }

  static parse(text: string): Range {
    const [from, to] = text.split('-').map((s) => parseInt(s));
    return new Range(from, to);
  }
}

type Input = [Range, Range][];

export class Day extends BaseDay<Input, number, number> {
  parse(input: string): Input {
    return input.split('\n').map((line) => {
      const [r1, r2] = line.split(',').map(Range.parse);
      return [r1, r2];
    });
  }
  async partOne(): Promise<number> {
    return this.input.filter(([r1, r2]) => r1.isWithin(r2) || r2.isWithin(r1))
      .length;
  }
  async partTwo(): Promise<number> {
    return this.input.filter(([r1, r2]) => r1.overlaps(r2) || r2.overlaps(r1))
      .length;
  }
}

export default Day;
