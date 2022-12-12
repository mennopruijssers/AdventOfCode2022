import { describe, expect, it } from '@jest/globals';
import { createChunks } from './chunks';

describe('chunks', () => {
  it('create chunks', () => {
    const output = createChunks([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3);
    expect(output).toStrictEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]);
  });
});
