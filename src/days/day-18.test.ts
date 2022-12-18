import Day from './day-18';
import { dayRunner } from './test-runner';

const example = `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`;

dayRunner(Day, example, 64, 58);
