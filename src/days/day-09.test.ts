import Day from './day-09';
import { dayRunner } from './test-util';

const example = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;

dayRunner(Day, example, 13, 1);

const example2 = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`;
dayRunner(Day, example2, undefined, 36);
