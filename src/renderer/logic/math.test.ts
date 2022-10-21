import { describe, it, expect } from 'vitest'
import { fisherYatesShuffle, flattenArray, scaleLog } from './math';

describe('scaleLog()', () => {
  const start = new Uint8Array([
    1, 2, 3, 4, 5, 6, 7,
    8, 9, 10, 11, 12, 13,
    14, 15, 16, 17, 18,
    19, 20
  ]);

  const expected = new Uint8Array([
    2, 2, 2, 2, 3, 3, 4,
    4, 5, 6, 7, 8, 9, 10,
    12, 14, 17
  ]);

  it("should be able to turn a linear array to log scale", () => {
    expect(scaleLog(start)).toEqual(expected);
  });
});

describe("fisherYatesShuffle()", () => {
  it("should be able to shuffle an array", () => {
    const start = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5];
    let willMutate = [...start];
    expect(fisherYatesShuffle(willMutate)).not.toEqual(start);
  });
});

describe("flattenArray()", () => {
  it("should be able to flatten an array with nested arrays", () => {
    const start = [
      [1, 2, 3],
      4,
      [5, 6, 7]
    ]
    const expected = [1, 2, 3, 4, 5, 6, 7];
    expect(flattenArray(start)).toEqual(expected);
  });
});