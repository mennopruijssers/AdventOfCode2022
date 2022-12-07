import { BaseDay } from '../day';

type Node = {
  size: number;
  name: string;
  children: Record<string, Node>;
  parent: Node | null;
  isDir: boolean;
};

function filterNodes(node: Node, filterFN: (n: Node) => boolean): Node[] {
  const nodes: Node[] = [];
  Object.values(node.children).forEach((child) => {
    nodes.push(...filterNodes(child, filterFN));
  });
  if (filterFN(node)) {
    nodes.push(node);
  }
  return nodes;
}

function calcSize(node: Node): number {
  if (!node.isDir) {
    return node.size;
  }
  if (node.size > 0) {
    return node.size;
  }
  const size = Object.values(node.children)
    .map((child) => calcSize(child))
    .reduce((sum, cur) => sum + cur, 0);
  node.size = size;

  return size;
}

export class Day extends BaseDay<Node, number, unknown> {
  parse(input: string): Node {
    const lines = input.split('\n');

    const rootNode: Node = {
      name: '/',
      children: {},
      isDir: true,
      size: 0,
      parent: null,
    };
    let currentNode: Node = rootNode;

    for (const line of lines) {
      if (line.startsWith('$')) {
        const command = line.substring(2);
        if (command.startsWith('cd ')) {
          const toDir = command.substring('cd '.length);
          if (toDir === '/') {
            currentNode = rootNode;
          } else if (toDir === '..') {
            if (currentNode.parent === null) {
              throw new Error('already at root');
            }
            currentNode = currentNode.parent;
          } else {
            if (!currentNode.children[toDir]) {
              throw new Error(`Dir ${toDir} not found`);
            }
            currentNode = currentNode.children[toDir];
          }
        }
      } else {
        const [sizeString, name] = line.split(' ');
        let isDir: boolean;
        let size = 0;
        if (sizeString === 'dir') {
          isDir = true;
        } else {
          isDir = false;
          size = parseInt(sizeString, 10);
        }
        const node: Node = {
          size,
          name,
          children: {},
          parent: currentNode,
          isDir,
        };
        currentNode.children[name] = node;
      }
    }

    return rootNode;
  }

  async partOne(): Promise<number> {
    calcSize(this.input);

    const emptyDirs = filterNodes(this.input, (node) => {
      return node.isDir && node.size === 0;
    });
    console.log(`no of empty dirs: ${emptyDirs.length}`);

    const bigDirs: Node[] = filterNodes(this.input, (node) => {
      return node.isDir && node.size <= 100000;
    });

    return bigDirs.map((dir) => dir.size).reduce((sum, cur) => sum + cur, 0);
  }

  async partTwo(): Promise<unknown> {
    const totalSpace = 70000000;
    const spaceNeeded = 30000000;
    const freeSpace = totalSpace - this.input.size;
    const toDelete = spaceNeeded - freeSpace;

    const candidatesForRemoval: Node[] = filterNodes(this.input, (n) => {
      return n.isDir && n.size >= toDelete;
    });

    candidatesForRemoval.sort((a, b) => a.size - b.size);
    return candidatesForRemoval[0].size;
  }
}

export default Day;
