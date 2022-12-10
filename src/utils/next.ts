#!/usr/bin/env node

/* istanbul ignore file */

import * as fs from 'fs/promises';

async function main(): Promise<void> {
  const inputs = await fs.readdir('./inputs/');

  const last = inputs.length === 0 ? 'day-00' : inputs.reverse()[0];
  const nextDayNumber = parseInt(last.substring('day-'.length)) + 1;

  console.log(`creating day ${nextDayNumber}`);
  await fs.writeFile(
    `inputs/day-${nextDayNumber.toString().padStart(2, '0')}.txt`,
    ''
  );

  const file = await fs.readFile('src/days/day-00.ts', 'utf8');
  const fileTest = await fs.readFile('src/days/day-00.test.ts', 'utf8');

  const result = file.replace(/00/g, `${nextDayNumber}`);
  const resultTest = fileTest.replace(/00/g, `${nextDayNumber}`);

  await fs.writeFile(`src/days/day-${nextDayNumber}.ts`, result);
  await fs.writeFile(`src/days/day-${nextDayNumber}.test.ts`, resultTest);
}
main()
  .then(() => console.log('done!'))
  .catch((err) => {
    console.error(err);
  });
