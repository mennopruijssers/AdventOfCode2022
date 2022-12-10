import { BaseDay } from '../day';

export class Day extends BaseDay<number[], number, number> {
  parse(input: string): number[] {
    const elves = input.split('\n\n');
    return elves.map((elf) =>
      elf
        .split('\n')
        .map((line) => parseInt(line, 10))
        .reduce((sum, current) => sum + current, 0)
    );
  }

  async partOne(): Promise<number> {
    const max = this.input.reduce(
      (currentMax, elf) => Math.max(currentMax, elf),
      0
    );
    return max;
  }

  async partTwo(): Promise<number> {
    const sorted = [...this.input].sort((a, b) => b - a);
    const top3 = sorted.slice(0, 3);
    return top3.reduce((sum, curr) => sum + curr, 0);
  }
}

export default Day;
