import { BaseDay } from '../day';

function intersection<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter((v) => arr2.includes(v));
}

function priority(c: string): number {
  const charCode = c.charCodeAt(0);
  if (charCode >= 97) {
    return charCode - 96;
  } else {
    return charCode - 38;
  }
}

export class Day extends BaseDay<string[], number, number> {
  parse(input: string): string[] {
    return input.split('\n').map((line) => line.trim());
  }
  async partOne(): Promise<number> {
    const intersections = this.input
      .map((line) => {
        const middle = line.length / 2;
        return [line.substring(0, middle), line.substring(middle)];
      })
      .map((compartments) => {
        return intersection([...compartments[0]], [...compartments[1]]);
      });

    const uniques = intersections.map((items) => [...new Set(items)]);

    const scoresPerBag = uniques.map((duplicates) => {
      return duplicates
        .map((c) => priority(c))
        .reduce((sum, cur) => sum + cur, 0);
    });

    const sum = scoresPerBag.reduce((sum, cur) => sum + cur, 0);

    return sum;
  }
  async partTwo(): Promise<number> {
    const groupSize = 3;
    const groups = this.input.reduce<string[][]>((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / groupSize);
      if (resultArray[chunkIndex]) {
        resultArray[chunkIndex].push(item);
      } else {
        resultArray[chunkIndex] = [item];
      }
      return resultArray;
    }, []);

    function findCommonItem(rugsacks: string[]) {
      const [first, ...others] = rugsacks;

      const common = [...first].find((char) => {
        return others.every((other) => other.indexOf(char) > -1);
      }) as string;

      return common;
    }

    const badges = groups.map((group) => findCommonItem(group));
    return badges
      .map((badge) => priority(badge))
      .reduce((sum, cur) => sum + cur, 0);
  }
}

export default Day;
