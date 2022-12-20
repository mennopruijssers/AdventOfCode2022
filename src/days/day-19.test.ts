/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect, it } from '@jest/globals';
import Day from './day-19';
import { dayRunner, slowTest } from './test-util';

const example = `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`;

slowTest(() => {
  dayRunner(Day, example, 33, 62 * 56);
});
