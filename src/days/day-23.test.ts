import Day from './day-23';
import { dayRunner } from './test-util';

const example = `
....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..`.trim();

dayRunner(Day, example, 110, 20);
