#!/usr/bin/env node

/* istanbul ignore file */

import * as fs from 'fs/promises';

async function main(): Promise<void> {
  const inputs = await fs.readdir('./inputs/');

  const last = inputs.length === 0 ? 'day0' : inputs.reverse()[0];
  const nextDayNumber = parseInt(last.substring('day'.length)) + 1;

  console.log(`creating day ${nextDayNumber}`);
  await fs.writeFile(`inputs/day${nextDayNumber}`, '');

  const file = await fs.readFile('src/days/day0.ts', 'utf8');
  const fileTest = await fs.readFile('src/days/day0.test.ts', 'utf8');

  const result = file.replace(/0/g, `${nextDayNumber}`);
  const resultTest = fileTest.replace(/0/g, `${nextDayNumber}`);

  await fs.writeFile(`src/days/day${nextDayNumber}.ts`, result);
  await fs.writeFile(`src/days/day${nextDayNumber}.test.ts`, resultTest);
}
main()
  .then(() => console.log('done!'))
  .catch((err) => {
    console.error(err);
  });
