import { BaseDay } from '../day';

export class Day extends BaseDay<{ value: number }[], number, number> {
  parse(input: string): { value: number }[] {
    const numbers = input
      .split('\n')
      .map((line) => ({ value: parseInt(line) }));
    return numbers;
  }

  mix(
    input: { value: number }[],
    mixed: { value: number }[]
  ): { value: number }[] {
    for (const n of input) {
      const index = mixed.indexOf(n);
      mixed.splice(index, 1);
      const newIndex = (index + n.value) % mixed.length;
      mixed.splice(newIndex, 0, n);
    }
    return mixed;
  }

  calculate(mixed: { value: number }[]): number {
    const indexOfZero = mixed.findIndex(({ value }) => value === 0);
    let sum = 0;
    for (let i = 1000; i <= 3000; i += 1000) {
      const index = (indexOfZero + i) % mixed.length;
      const value = mixed[index].value;
      sum += value;
    }

    return sum;
  }

  async partOne(): Promise<number> {
    const mixed = this.mix(this.input, [...this.input]);

    return this.calculate(mixed);
  }

  async partTwo(): Promise<number> {
    const decryptionKey = 811589153;
    const input = this.input.map(({ value }) => ({
      value: value * decryptionKey,
    }));

    let mixed = [...input];
    for (let i = 0; i < 10; i++) {
      mixed = this.mix(input, mixed);
    }

    return this.calculate(mixed);
  }
}

export default Day;
