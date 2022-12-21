#!/usr/bin/env node

/* istanbul ignore file */

import { assert } from 'console';
import * as fs from 'fs/promises';

async function main(): Promise<void> {
  const inputs = await fs.readdir('./inputs/');

  const args = process.argv;
  let dayNumber;
  if (args.length === 2 || args[2] === 'last') {
    dayNumber = inputs
      .map((fileName) => parseInt(fileName.substring('day-'.length)))
      .filter((n) => !isNaN(n))
      .sort((a, b) => b - a)[0];
  } else {
    dayNumber = parseInt(args[2], 10);
  }
  if (isNaN(dayNumber)) {
    throw new Error(`invalid day: "${args[2]}"!`);
  }

  console.log(`running: day ${dayNumber}`);

  const paddedDay = dayNumber.toString().padStart(2, '0');
  const input = await fs.readFile(`./inputs/day-${paddedDay}.txt`, {
    encoding: 'utf-8',
  });
  const DayType = (await import(`../days/day-${paddedDay}`)).default;
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
