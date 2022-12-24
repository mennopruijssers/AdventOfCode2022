import { expect } from '@jest/globals';
import Day from './day-24';
import { dayRunner } from './test-util';

const example = `
#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`.trim();

dayRunner(
  Day,
  example,
  (s) => {
    expect(s.minutes).toBe(18);
  },
  54
);
