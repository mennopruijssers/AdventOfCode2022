import { beforeEach, expect, it } from '@jest/globals';
import { BaseDay } from '../day';

export function dayRunner<T1, T2>(
  DayType: new (input: string) => BaseDay<unknown, T1, T2>,
  example: string,
  partOne?: T1,
  partTwo?: T2
) {
  let day: BaseDay<unknown, T1, T2>;

  beforeEach(async () => {
    day = new DayType(example);
  });

  if (partOne) {
    it('part 1', async () => {
      const output = await day.partOne();
      expect(output).toBe(partOne);
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
