#!/usr/bin/env node

/* istanbul ignore file */

import { assert } from 'console';
import * as fs from 'fs/promises';

async function main(): Promise<void> {
  const inputs = await fs.readdir('./inputs/');

  const dayNumber = inputs
    .map((fileName) => parseInt(fileName.substring('day-'.length)))
    .filter((n) => !isNaN(n))
    .sort((a, b) => b - a)[0];
  console.log(`running: day ${dayNumber}`);

  const paddedDay = dayNumber.toString().padStart(2, '0');
  const input = await fs.readFile(`./inputs/day-${paddedDay}.txt`, {
    encoding: 'utf-8',
  });
  const DayType = (await import(`./days/day-${paddedDay}`)).default;
  const day = new DayType(input);
  assert(day);
  console.log('running part 1');
  console.time('part1');
  const output = await day.partOne();
  console.timeEnd('part1');
  day.printResultOne(output);

  console.log('running part 2');
  console.time('part2');
  const output2 = await day.partTwo(output);
  console.timeEnd('part2');
  day.printResultTwo(output2);
}

main()
  .then(() => console.log('done!'))
  .catch((err) => {
    console.error(err);
  });
