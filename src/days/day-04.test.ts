import { describe, expect, it } from '@jest/globals';
import { Day, Range } from './day-04';
import { dayRunner } from './test-runner';

const example = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

dayRunner(Day, example, 2, 4);

describe('Range', () => {
  it('parses', () => {
    const range = Range.parse('1-4');
    expect(range.from).toBe(1);
    expect(range.to).toBe(4);
  });

  describe('isWithin', () => {
    it('returns false if fully not within', () => {
      expect(new Range(1, 5).isWithin(new Range(6, 7))).toBe(false);
      expect(new Range(6, 7).isWithin(new Range(1, 5))).toBe(false);
    });

    it('returns false if partially not within', () => {
      expect(new Range(1, 5).isWithin(new Range(2, 7))).toBe(false);
      expect(new Range(2, 7).isWithin(new Range(1, 5))).toBe(false);
    });

    it('returns true if fully within', () => {
      expect(new Range(2, 5).isWithin(new Range(1, 5))).toBe(true);
    });

    it('returns true if equal', () => {
      expect(new Range(1, 5).isWithin(new Range(1, 5))).toBe(true);
    });

    it('returns true if in edges', () => {
      expect(new Range(1, 1).isWithin(new Range(1, 5))).toBe(true);
      expect(new Range(5, 5).isWithin(new Range(1, 5))).toBe(true);
    });
  });

  describe('overlaps', () => {
    it('returns false if fully not within', () => {
      expect(new Range(1, 5).overlaps(new Range(6, 7))).toBe(false);
      expect(new Range(6, 7).overlaps(new Range(1, 5))).toBe(false);
    });

    it('returns true if fully within', () => {
      expect(new Range(2, 5).overlaps(new Range(1, 5))).toBe(true);
    });

    it('returns true if equal', () => {
      expect(new Range(1, 5).overlaps(new Range(1, 5))).toBe(true);
    });

    it('returns true if in edges', () => {
      expect(new Range(1, 1).overlaps(new Range(1, 5))).toBe(true);
      expect(new Range(5, 5).overlaps(new Range(1, 5))).toBe(true);
    });

    it('returns true if partially within', () => {
      expect(new Range(1, 5).overlaps(new Range(2, 7))).toBe(true);
      expect(new Range(2, 7).overlaps(new Range(1, 5))).toBe(true);
    });
  });
});
