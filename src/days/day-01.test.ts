import Day from './day-01';
import { dayRunner } from './test-util';

const example = `1000
  2000
  3000

  4000

  5000
  6000

  7000
  8000
  9000

  10000`;

dayRunner(Day, example, 24000, 45000);
