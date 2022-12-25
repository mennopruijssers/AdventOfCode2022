import { beforeEach, expect, it } from '@jest/globals';
import { BaseDay } from '../day';

type ValidatorFN<T> = (output: T) => void;
export function dayRunner<T1, T2>(
  DayType: new (input: string) => BaseDay<unknown, T1, T2>,
  example: string,
  partOne?: T1 | ValidatorFN<T1>,
  partTwo?: T2
) {
  let day: BaseDay<unknown, T1, T2>;

  beforeEach(async () => {
    day = new DayType(example);
  });

  if (partOne) {
    it('part 1', async () => {
      const output = await day.partOne();
      if (typeof partOne === 'function') {
        (partOne as ValidatorFN<T1>)(output);
      } else {
        expect(output).toBe(partOne);
      }
    });
  }

  if (partTwo) {
    it('part 2', async () => {
      const output1 = await day.partOne();
      const output = await day.partTwo(output1);
      expect(output).toBe(partTwo);
    });
  }
}

export function slowTest(fn: () => unknown): void {
  //istanbul ignore next
  if (process.env['ENABLE_SLOW_TEST'] === '1') {
    fn();
  }
  //istanbul ignore next
  else {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it.skip('slow tests skipped', () => {});
  }
}
