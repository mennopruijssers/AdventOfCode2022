import { BaseDay } from '../day';
import { notEmpty } from '../utils/predicates';
import { Point } from '../utils/types';

class Sensor {
  point: Point;
  closestBeacon: Point;
  distance: number;

  constructor(point: Point, closestBeacon: Point) {
    this.point = point;
    this.closestBeacon = closestBeacon;
    this.distance = manhattanDistance(point, closestBeacon);
  }

  coversY(y: number): boolean {
    if (this.point.y >= y && this.point.y - this.distance <= y) return true;

    if (this.point.y <= y && this.point.y + this.distance >= y) return true;

    return false;
  }

  xRange(y: number, max: number): [number, number] | undefined {
    const diffX = this.distance - Math.abs(this.point.y - y);
    if (diffX < 0) return undefined;

    return [
      Math.max(0, this.point.x - diffX),
      Math.min(max, this.point.x + diffX),
    ];
  }

  getEmptyPoints(y: number): Point[] {
    const points: Point[] = [];

    const diffX = this.distance - Math.abs(this.point.y - y);

    for (let x = -diffX; x <= diffX; x++) {
      points.push({ x: this.point.x + x, y });
    }

    return points;
  }
}

function manhattanDistance(p1: Point, p2: Point): number {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

export class Day extends BaseDay<Sensor[], number, number> {
  parse(input: string): Sensor[] {
    return input.split('\n').map((line) => {
      const match =
        /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/.exec(
          line
        );
      // istanbul ignore next
      if (!match) {
        throw new Error('invalid line');
      }

      const coordinates = match.slice(1).map((c) => parseInt(c, 10));

      return new Sensor(
        { x: coordinates[0], y: coordinates[1] },
        { x: coordinates[2], y: coordinates[3] }
      );
    });
  }

  async partOne(): Promise<number> {
    // istanbul ignore next: switch between test and real input:
    const y = this.input.length === 14 ? 10 : 2000000;

    const sensors = this.input.filter((sensor) => sensor.coversY(y));

    const beaconXs: Set<number> = new Set();
    const emptyXs: Set<number> = new Set();

    for (const s of sensors) {
      for (const { x } of s.getEmptyPoints(y)) {
        emptyXs.add(x);
        if (s.closestBeacon.y === y) {
          beaconXs.add(s.closestBeacon.x);
        }
      }
    }
    return emptyXs.size - beaconXs.size;
  }

  async partTwo(): Promise<number> {
    //istanbul ignore next
    const max = this.input.length === 14 ? 20 : 4000000;

    for (let y = 0; y <= max; y++) {
      const ranges = this.input
        .map((s) => s.xRange(y, max))
        .filter(notEmpty)
        .sort((a, b) => a[0] - b[0]);
      let x = 0;
      for (const r of ranges) {
        if (r[1] < x) continue;
        if (r[0] <= x) {
          x = r[1];
        } else {
          return (x + 1) * 4000000 + y;
        }
        if (x === max) break;
      }
      // istanbul ignore next: doesn't happen in example
      if (x !== max) {
        return (x + 1) * 4000000 + y;
      }
    }
    //istanbul ignore next: shouldn't happen
    throw new Error('beacon not found');
  }
}

export default Day;
