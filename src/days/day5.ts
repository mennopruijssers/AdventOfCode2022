import { BaseDay } from '../day';

type Move = {
  amount: number;
  from: number;
  to: number;
};
type Crate = string;
type Stack = Crate[];
type Input = {
  stacks: Stack[];
  moves: Move[];
};

export function parseStacks(input: string): Stack[] {
  const [_first, ...rows] = input.split('\n').reverse();
  const stacks: Stack[] = [];

  for (const row of rows) {
    for (let i = 1; i < row.length; i += 4) {
      const char = row.charAt(i);
      if (char !== ' ') {
        const index = Math.floor(i / 4);
        stacks[index] = [...(stacks[index] || []), char];
      }
    }
  }
  return stacks;
}

export function parseMoves(input: string): Move[] {
  return input
    .split('\n')
    .map((line) => {
      const matches = line.match(/move (\d+) from (\d+) to (\d+)/);
      /* istanbul ignore next */
      if (matches === null) {
        return null;
      }
      const amount = parseInt(matches[1]);
      const from = parseInt(matches[2]);
      const to = parseInt(matches[3]);
      return { amount, from, to };
    })
    .filter((x): x is Move => x !== null);
}

export class Day extends BaseDay<Input, string, string> {
  parse(input: string): Input {
    const [stacksInput, movesInput] = input.split('\n\n');

    const stacks = parseStacks(stacksInput);
    const moves = parseMoves(movesInput);

    return { stacks, moves };
  }
  async partOne(): Promise<string> {
    const stacks = this.input.stacks.map((s) => [...s]);

    function applyMove({ amount, from, to }: Move): void {
      for (let i = 0; i < amount; i++) {
        const crate = stacks[from - 1].pop();
        /* istanbul ignore next */
        if (crate === undefined) {
          throw new Error('no crates left');
        }
        stacks[to - 1].push(crate);
      }
    }

    for (const move of this.input.moves) {
      applyMove(move);
    }

    return stacks.map((s) => s[s.length - 1]).join('');
  }
  async partTwo(): Promise<string> {
    const stacks = this.input.stacks.map((s) => [...s]);

    function applyMove({ amount, from, to }: Move): void {
      const fromStack = stacks[from - 1];
      const toStack = stacks[to - 1];

      const crates = fromStack.splice(fromStack.length - amount, amount);
      toStack.push(...crates);
    }

    for (const move of this.input.moves) {
      applyMove(move);
    }

    return stacks.map((s) => s[s.length - 1]).join('');
  }
}

export default Day;
