import { describe, expect, it } from "vitest";
import { computeWidthPercentage, fisherYatesShuffle, flattenArray, infinityClamp, interpolateArray, percentToLog, scaleLog } from "./math";

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

describe("infinityClamp()", () => {
  it("returns the number if it is finite", () => {
    const num = 3;
    const min = -5;
    const result = infinityClamp(num, min);
    expect(result).toBe(num);
  });

  it("returns the min if the number is infinite", () => {
    const num = Infinity;
    const min = -5;
    const result = infinityClamp(num, min);
    expect(result).toBe(min);
  });

  it("returns the min if the number is negative infinite", () => {
    const num = -Infinity;
    const min = -5;
    const result = infinityClamp(num, min);
    expect(result).toBe(min);
  });
});

describe("computeWidthPercentage", () => {
  it("returns 0 when value is less than min", () => {
    const min = 10;
    const max = 20;
    const value = 5;
    const result = computeWidthPercentage(min, max, value);
    expect(result).toBe(0);
  });

  it("returns 100 when value is greater than max", () => {
    const min = 10;
    const max = 20;
    const value = 25;
    const result = computeWidthPercentage(min, max, value);
    expect(result).toBe(100);
  });

  it("returns correct percentage when value is between min and max", () => {
    const min = 10;
    const max = 20;
    const value = 15;
    const result = computeWidthPercentage(min, max, value);
    expect(result).toBe(50);
  });
  it("returns 0 when value is equal to min", () => {
    const min = 10;
    const max = 20;
    const value = 10;
    const result = computeWidthPercentage(min, max, value);
    expect(result).toBe(0);
  });

  it("returns 100 when value is equal to max", () => {
    const min = 10;
    const max = 20;
    const value = 20;
    const result = computeWidthPercentage(min, max, value);
    expect(result).toBe(100);
  });

  it("handles negative numbers correctly", () => {
    const min = -20;
    const max = -10;
    const value = -15;
    const result = computeWidthPercentage(min, max, value);
    expect(result).toBe(50);
  });
});

describe("percentToLog", () => {
  it("returns the correct value for 0%", () => {
    const percentage = 0;
    const min = 10;
    const max = 20;
    const result = percentToLog(percentage, min, max);
    expect(result).toBeCloseTo(min);
  });

  it("returns the correct value for 100%", () => {
    const percentage = 100;
    const min = 10;
    const max = 20;
    const result = percentToLog(percentage, min, max);
    expect(result).toBeCloseTo(max);
  });
});
