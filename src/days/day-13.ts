import { BaseDay } from '../day';
import { isArray } from '../utils/predicates';

type Pair = [Packet, Packet];
type Packet = PacketData[];
type PacketData = PacketData[] | number;

function convertToArray(p: PacketData): PacketData[] {
  return isArray(p) ? p : [p];
}

function isOrderCorrect(p1: PacketData, p2: PacketData): boolean | undefined {
  if (!isArray<PacketData>(p1) && !isArray<PacketData>(p2)) {
    if (p1 < p2) return true;
    if (p1 > p2) return false;
    return undefined;
  }
  const a1 = convertToArray(p1);
  const a2 = convertToArray(p2);

  for (let i = 0; i < a1.length; i++) {
    if (a2.length < i + 1) {
      return false;
    }
    const order = isOrderCorrect(a1[i], a2[i]);
    if (order !== undefined) {
      return order;
    }
  }

  return a2.length > a1.length ? true : undefined;
}

function isPacketOrderCorrect(p1: Packet, p2: Packet): boolean {
  const order = isOrderCorrect(p1, p2);
  //istanbul ignore next
  if (order === undefined) {
    throw new Error('should not happen');
  }
  return order;
}

export class Day extends BaseDay<Pair[], number, number> {
  parse(input: string): Pair[] {
    const pairs = input.split('\n\n').map((line) => line.split('\n'));

    return pairs.map(([line1, line2]) => {
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
    const dividerPackets = this.parse(`[[2]]
    [[6]]`)[0];
    const allPackets = [...dividerPackets, ...this.input.flat()];

    const sorted = allPackets.sort((a, b) => {
      if (isOrderCorrect(a, b)) {
        return -1;
      } else {
        return 1;
      }
    });

    const indices = dividerPackets.map((p) => sorted.indexOf(p) + 1);

    const product = indices.reduce((product, current) => product * current, 1);
    return product;
  }
}

export default Day;
