import { describe, it, expect, vi } from "vitest";
import {
  getLogIndex,
  normalize8bit,
  logParabolicSpectrum,
  fisherYatesShuffle,
  flattenArray,
  percentToLogValue,
  logValueToPercentage,
  infinityClamp,
  mapValueToPercentage,
  floatToInt16
} from "./math";

describe("getLogIndex", () => {
  it("computes a log index in range", () => {
    const result = getLogIndex(50, 1, 100);
    expect(result).toBeGreaterThan(1);
    expect(result).toBeLessThan(100);
  });
});

describe("normalize8bit", () => {
  it("clamps values below 0", () => {
    expect(normalize8bit(-50)).toBe(0);
  });
  it("clamps values above 255", () => {
    expect(normalize8bit(300)).toBe(1);
  });
  it("returns correct normalized value", () => {
    expect(normalize8bit(127.5)).toBeCloseTo(0.5);
  });
});

describe("logParabolicSpectrum", () => {
  it("returns a Float32Array of specified length", () => {
    const data = new Uint8Array([0, 64, 128, 255]);
    const result = logParabolicSpectrum(data, 4);
    expect(result).toBeInstanceOf(Float32Array);
    expect(result.length).toBe(4);
    for (const val of result) {
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThanOrEqual(1);
    }
  });
});

describe("fisherYatesShuffle", () => {
  it("shuffles array in-place and returns same length", () => {
    vi.spyOn(Math, "random").mockReturnValueOnce(0.1).mockReturnValue(0.9); // deterministic
    const arr = [1, 2, 3, 4];
    const shuffled = fisherYatesShuffle([...arr]);
    expect(shuffled.length).toBe(4);
    expect(shuffled.sort()).toEqual(arr.sort());
    vi.restoreAllMocks();
  });
});

describe("flattenArray", () => {
  it("flattens nested arrays", () => {
    const nested = [1, [2, [3, 4]], 5];
    const flat = flattenArray(nested);
    expect(flat).toEqual([1, 2, 3, 4, 5]);
  });

  it("handles flat arrays unchanged", () => {
    expect(flattenArray([1, 2, 3])).toEqual([1, 2, 3]);
  });
});

describe("percentToLogValue", () => {
  it("returns correct value at 0%", () => {
    expect(percentToLogValue(0, 1, 100)).toBeCloseTo(1);
  });
  it("returns correct value at 100%", () => {
    expect(percentToLogValue(100, 1, 100)).toBeCloseTo(100);
  });
});

describe("logValueToPercentage", () => {
  it("returns 0% at min", () => {
    expect(logValueToPercentage(1, 1, 100)).toBeCloseTo(0);
  });
  it("returns 100% at max", () => {
    expect(logValueToPercentage(100, 1, 100)).toBeCloseTo(100);
  });
});

describe("infinityClamp", () => {
  it("returns value if finite", () => {
    expect(infinityClamp(5, 10)).toBe(5);
  });
  it("clamps to min if infinite", () => {
    expect(infinityClamp(Infinity, 10)).toBe(10);
    expect(infinityClamp(-Infinity, 10)).toBe(10);
    expect(infinityClamp(NaN, 10)).toBe(10);
  });
});

describe("floatToInt16", () => {
  it("converts float values to Int16", () => {
    const floatArray = new Float32Array([-1, -0.5, 0, 0.5, 1]);
    const intArray = floatToInt16(floatArray);
    expect(intArray).toBeInstanceOf(Int16Array);
    expect(intArray).toEqual(new Int16Array([-32768, -16384, 0, 16383, 32767]));
  });
});
