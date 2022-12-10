import { BaseDay } from '../day';

type State = { register: number; cycle: number };
type Instruction = ({ register, cycle }: State) => State;
type InstructionParser = (input: number | undefined) => Instruction;

const instructionMap: Record<string, InstructionParser> = {
  noop: () => {
    return ({ register, cycle }) => ({ register, cycle: cycle + 1 });
  },
  addx: (input) => {
    /* istanbul ignore next */
    if (input === undefined) {
      throw new Error('[addx] Missing input');
    }
    return ({ register, cycle }) => ({
      register: register + input,
      cycle: cycle + 2,
    });
  },
};

export class Day extends BaseDay<Instruction[], number, string> {
  parse(input: string): Instruction[] {
    return input.split('\n').map((line) => {
      const [instruction, param] = line.split(' ');
      /* istanbul ignore next */
      if (!instructionMap[instruction]) {
        throw new Error(`Instruction ${instruction} unsupported`);
      }
      const input = parseInt(param);
      return instructionMap[instruction](input);
    });
  }

  async partOne(): Promise<number> {
    let state: State = { cycle: 1, register: 1 };
    let instructionIndex = 0;
    const results: State[] = [];
    let cycleToRecord = 20;
    while (cycleToRecord <= 220) {
      const instruction = this.input[instructionIndex];
      instructionIndex = instructionIndex + (1 % this.input.length);
      const newState = instruction(state);

      if (newState.cycle > cycleToRecord) {
        results.push({ cycle: cycleToRecord, register: state.register });
        cycleToRecord += 40;
      }

      state = newState;
    }

    const sum = results
      .map(({ cycle, register }) => cycle * register)
      .reduce((sum, cur) => sum + cur, 0);
    return sum;
  }

  async partTwo(): Promise<string> {
    let state: State = { cycle: 1, register: 1 };
    let instructionIndex = 0;
    const output: boolean[] = [];
    while (state.cycle <= 240) {
      const instruction = this.input[instructionIndex];
      instructionIndex = instructionIndex + (1 % this.input.length);
      const newState = instruction(state);

      for (let cycle = state.cycle; cycle < newState.cycle; cycle++) {
        const column = (cycle - 1) % 40;
        if (Math.abs(state.register - column) <= 1) {
          output.push(true);
        } else {
          output.push(false);
        }
      }

      state = newState;
    }

    const liens = output
      .slice(0, 6 * 40)
      .map((b) => (b ? '#' : '.'))
      .reduce<string[]>((results, char, index) => {
        const chunkIndex = Math.floor(index / 40);

        results[chunkIndex] = (results[chunkIndex] || '') + char;
        return results;
      }, []);

    return liens.join('\n');
  }

  /* istanbul ignore next */
  override printResultTwo(output: string): void {
    console.log(output.replaceAll('.', ' '));
  }
}

export default Day;
