import { describe, expect, it } from "vitest";
import { fisherYatesShuffle, flattenArray, interpolateArray, scaleLog } from "./math";

describe.concurrent("scaleLog()", () => {
  const start = new Uint8Array([
    1, 2, 3, 4, 5, 6, 7,
    8, 9, 10, 11, 12, 13,
    14, 15, 16, 17, 18,
    19, 20
  ]);

  const expected = new Uint8Array([
    2, 2, 2, 2, 3, 3, 4,
    4, 5, 6, 7, 8, 9, 10,
    12, 14, 17, 0
  ]);

  it("should be able to turn a linear array to log scale", () => {
    expect(scaleLog(start)).toEqual(expected);
  });
});

describe.concurrent("fisherYatesShuffle()", () => {
  it("should be able to shuffle an array", () => {
    const start = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5];
    const willMutate = [...start];
    expect(fisherYatesShuffle(willMutate)).not.toEqual(start);
  });
});

describe.concurrent("flattenArray()", () => {
  it("should be able to flatten an array with nested arrays", () => {
    const start = [
      [1, 2, 3],
      4,
      [5, 6, 7]
    ];
    const expected = [1, 2, 3, 4, 5, 6, 7];
    expect(flattenArray(start)).toEqual(expected);
  });
});

describe.concurrent("interpolateArray()", () => {
  const start = [1, 2, 3];
  const target = [1, 1.5, 2, 2.5, 3];
  const targetLength = 5;
  const result = interpolateArray(start, targetLength);

  it("should be able to interpolate an array", () => {
    expect(result).toEqual(target);
  });

  it("should have length of 5", () => {
    expect(result.length).toEqual(targetLength);
  });
});