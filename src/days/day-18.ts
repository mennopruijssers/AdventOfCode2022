import { BaseDay } from '../day';
import { Point3d } from '../utils/types';

const sides: (keyof Point3d)[] = ['x', 'y', 'z'];

function getNeighbours(p: Point3d): Point3d[] {
  const neighbours: Point3d[] = [];
  sides.forEach((side) => {
    neighbours.push({ ...p, [side]: p[side] - 1 });
    neighbours.push({ ...p, [side]: p[side] + 1 });
  });
  return neighbours;
}

function countSides(points: Point3d[]): [number, Set<string>] {
  const pointsSet = new Set<string>(points.map((p) => JSON.stringify(p)));

  let count = 0;
  const missing = points.flatMap((p) => {
    const missingNeighbours = getNeighbours(p)
      .map((p) => JSON.stringify(p))
      .filter((nb) => !pointsSet.has(nb));
    count += missingNeighbours.length;
    return missingNeighbours;
  });
  return [count, new Set(missing)];
}

export class Day extends BaseDay<Point3d[], number, number> {
  parse(input: string): Point3d[] {
    return input.split('\n').map((line) => {
      const [x, y, z] = line.split(',').map((c) => parseInt(c, 10));
      return { x, y, z };
    });
  }

  async partOne(): Promise<number> {
    return countSides(this.input)[0];
  }

  async partTwo(): Promise<number> {
    const [_, missing] = countSides(this.input);
    const [min, max] = this.input.reduce(
      ([min, max], { x, y, z }) => {
        return [
          {
            x: Math.min(min.x, x),
            y: Math.min(min.y, y),
            z: Math.min(min.z, z),
          },
          {
            x: Math.max(max.x, x),
            y: Math.max(max.y, y),
            z: Math.max(max.z, z),
          },
        ];
      },
      [
        {
          x: Number.MAX_SAFE_INTEGER,
          y: Number.MAX_SAFE_INTEGER,
          z: Number.MAX_SAFE_INTEGER,
        },
        {
          x: Number.MIN_SAFE_INTEGER,
          y: Number.MIN_SAFE_INTEGER,
          z: Number.MIN_SAFE_INTEGER,
        },
      ]
    );

    const points = new Set<string>(this.input.map((p) => JSON.stringify(p)));

    function isInterior(pKey: string): [boolean, Set<string>] {
      const p = JSON.parse(pKey) as Point3d;
      const visited = new Set<string>();
      const queue = [p];

      let current: Point3d | undefined;
      while ((current = queue.pop())) {
        visited.add(JSON.stringify(current));

        const neighbours = getNeighbours(current);
        const isExterior = neighbours.some(
          (nb) =>
            nb.x < min.x ||
            nb.x > max.x ||
            nb.y < min.y ||
            nb.y > max.y ||
            nb.z < min.z ||
            nb.z > max.z
        );
        if (isExterior) return [false, visited];

        neighbours.forEach((nb) => {
          const nbKey = JSON.stringify(nb);
          // istanbul ignore next
          if (!points.has(nbKey) && !visited.has(nbKey)) {
            queue.push(nb);
          }
        });
      }
      return [true, visited];
    }

    for (const pKey of missing) {
      // istanbul ignore next
      if (points.has(pKey)) {
        continue;
      }

      const [interior, visited] = isInterior(pKey);
      if (interior) {
        visited.forEach((p) => points.add(p));
      }
    }

    return countSides([...points].map((k) => JSON.parse(k) as Point3d))[0];
  }
}

export default Day;
