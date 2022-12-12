import { Grid } from './grid';
import { Point } from './types';

type Opts<T> = {
  grid: T[][];
  start: Point;
  isEnd: isEndFN<T>;
  isAllowed: (from: T, to: T) => boolean;
  calculateCost?: (from: T, to: T) => number;
};

type isEndFN<T> = ({ point, value }: { point: Point; value: T }) => boolean;
type Node<T> = {
  value: T;
  parent: Point | undefined;
  cost: number;
};

function getPath(grid: Grid<Node<unknown>>, end: Point): Point[] {
  const path: Point[] = [];
  let current: Point | undefined = end;
  while (current) {
    path.push(current);
    current = grid.get(current)?.parent;
  }

  return path.reverse();
}

export function toEndPoint(endPoint: Point): isEndFN<unknown> {
  return ({ point: { x, y } }) => {
    return x === endPoint.x && y === endPoint.y;
  };
}

export function findShortestPath<T>({
  grid: gridValues,
  start,
  isEnd,
  isAllowed,
  calculateCost = () => 1,
}: Opts<T>): Point[] {
  const queue: Point[] = [start];
  const grid = new Grid<Node<T>>(
    gridValues.map((a) =>
      a.map((value) => ({ value, parent: undefined, cost: Infinity }))
    )
  );

  const startNode = grid.get(start);
  startNode.cost = 0;
  let current: Point | undefined;
  while ((current = queue.shift()) != undefined) {
    const currentNode = grid.get(current);
    if (isEnd({ point: current, value: currentNode.value })) {
      return getPath(grid, current);
    }

    const neighbours = grid.getNeighbours(current);
    neighbours.forEach((neighbour) => {
      const node = grid.get(neighbour);
      if (!isAllowed(currentNode.value, node.value)) {
        return;
      }
      const cost =
        currentNode.cost + calculateCost(currentNode.value, node.value);
      if (node.cost > cost) {
        node.cost = cost;
        node.parent = current;

        if (!queue.some(({ x, y }) => x === neighbour.x && y === neighbour.y)) {
          queue.push(neighbour);
        }
      }
    });

    queue.sort((p1, p2) => {
      const cost1 = grid.get(p1).cost;
      const cost2 = grid.get(p2).cost;
      return cost1 - cost2;
    });
  }

  throw new Error("can't find path");
}
