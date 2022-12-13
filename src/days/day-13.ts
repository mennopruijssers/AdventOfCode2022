import { BaseDay } from '../day';
import { isArray } from '../utils/predicates';

type PacketData = PacketData[] | number;
type Packet = PacketData[];
type Pair = [Packet, Packet];

// function parsePacketData(string: string): [PacketData, string] {
//   if (string.startsWith('[')) {
//     string = string.substring(1);
//     const data = [];
//     while (!string.startsWith(']')) {
//       const [item, left] = parsePacketData(string);
//       data.push(item);
//       string = left;
//     }
//     string = string.substring(1);
//   } else {
//     const [digitString, left] = string.split(',', 2);
//     return [parseInt(digitString, 10), left];
//   }
// }

function isOrderCorrect(p1: PacketData, p2: PacketData): boolean | undefined {
  if (!isArray<PacketData>(p1) && !isArray<PacketData>(p2)) {
    if (p1 < p2) return true;
    if (p1 > p2) return false;
    return undefined;
  }
  let a1: PacketData[];
  let a2: PacketData[];

  if (isArray<PacketData>(p1)) {
    a1 = p1;
  } else {
    a1 = [p1];
  }
  if (isArray<PacketData>(p2)) {
    a2 = p2;
  } else {
    a2 = [p2];
  }

  for (let i = 0; i < a1.length; i++) {
    if (a2.length < i + 1) {
      return false;
    }
    const order = isOrderCorrect(a1[i], a2[i]);
    if (order !== undefined) {
      return order;
    }
  }
  if (a2.length > a1.length) {
    return true;
  }

  return undefined;
}

function isPacketOrderCorrect(p1: Packet, p2: Packet): boolean {
  const order = isOrderCorrect(p1, p2);
  if (order === undefined) {
    throw new Error('should not happen');
  }
  return order;
}

export class Day extends BaseDay<Pair[], number, number> {
  parse(input: string): Pair[] {
    const pairs = input.split('\n\n').map((line) => line.split('\n'));

    return pairs.map(([line1, line2]) => {
      // return [parsePacketData(line1),parsePacketData(line2)]
      return [JSON.parse(line1), JSON.parse(line2)];
    });
  }

  async partOne(): Promise<number> {
    const pairs = this.input;

    const correct = pairs.map(([p1, p2]) => isPacketOrderCorrect(p1, p2));
    return correct.reduce((sum, isCorrect, index) => {
      if (isCorrect) {
        return sum + (index + 1);
      } else {
        return sum;
      }
    }, 0);
  }

  async partTwo(): Promise<number> {
    return 42;
  }
}

export default Day;
