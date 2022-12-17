import { BaseDay } from '../day';

export class Day extends BaseDay<string[], number, number> {
  parse(input: string): string[] {
    return input.split('\n');
  }

  async partOne(): Promise<number> {
    return 42;
  }

  async partTwo(): Promise<number> {
    return 42;
  }
}

export default Day;
