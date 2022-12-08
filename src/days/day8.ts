import { BaseDay } from '../day';

function markVisibleTrees(input: Tree[]): void {
  let maxHeight = -1;
  for (let i = 0; i < input.length; i++) {
    const tree = input[i];
    if (tree.height > maxHeight) {
      tree.visible = true;
      maxHeight = tree.height;
    }
  }
}

export function setViewingDistance(
  line: Tree[],
  key: keyof ViewingDistances
): void {
  line.map((tree, index) => {
    if (index === 0) {
      tree.viewingDistances[key] = 0;
      return;
    }

    let visibleTrees = 0;
    for (let i = index - 1; i >= 0; i--) {
      const previousTree = line[i];
      visibleTrees++;
      if (previousTree.height >= tree.height) {
        break;
      }
    }
    tree.viewingDistances[key] = visibleTrees;
  });
}

type ViewingDistances = {
  left: number;
  right: number;
  up: number;
  down: number;
};

type Tree = {
  height: number;
  visible: boolean | null;
  viewingDistances: ViewingDistances;
};

export class Day extends BaseDay<Tree[][], number, number> {
  parse(input: string): Tree[][] {
    return input.split('\n').map((line) => {
      return [...line]
        .map((c) => parseInt(c, 10))
        .map((height) => ({
          height,
          visible: null,
          viewingDistances: { left: -1, right: -1, up: -1, down: -1 },
        }));
    });
  }

  async partOne(): Promise<number> {
    // check from left to right:
    this.input.map((line) => {
      markVisibleTrees(line);
    });

    //check from right to left:
    this.input.map((line) => {
      markVisibleTrees([...line].reverse());
    });

    for (let i = 0; i < this.input[0].length; i++) {
      const column = this.input.map((line) => line[i]);

      //check from top to bottom
      markVisibleTrees(column);

      //check from bottom to top
      markVisibleTrees(column.reverse());
    }

    return this.input
      .map((line) => line.filter(({ visible }) => visible).length)
      .reduce((sum, curr) => sum + curr, 0);
  }

  async partTwo(): Promise<number> {
    this.input.map((line) => {
      //set left distances:
      setViewingDistance(line, 'left');
      setViewingDistance([...line].reverse(), 'right');
    });

    for (let i = 0; i < this.input[0].length; i++) {
      const column = this.input.map((line) => line[i]);
      setViewingDistance(column, 'up');
      setViewingDistance([...column].reverse(), 'down');
    }

    return this.input
      .map((line) => {
        return line.map((tree) => {
          const values: number[] = Object.values(tree.viewingDistances);
          return values.reduce((acc, cur) => acc * cur, 1);
        });
      })
      .flat()
      .reduce((max, cur) => Math.max(max, cur), -1);
  }
}

export default Day;
