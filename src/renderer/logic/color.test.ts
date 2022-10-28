import { describe, expect, it } from "vitest";
import { componentToHex, rgbToHex } from "./color";

describe.concurrent("rgbToHex()", () => {
  const result = rgbToHex(255, 255, 255);

  it("should return a string", () => {
    expect(result).toBeTypeOf("string");
  });

  it("should work with number inputs", () => {
    const result = rgbToHex(255, 255, 255);
    expect(result).toEqual("#ffffff");
  });

  it("should work with string inputs", () => {
    const result = rgbToHex("255", "255", "255");
    expect(result).toEqual("#ffffff");
  });

  it("should start with a hashtag #", () => {
    expect(result.startsWith("#")).toBeTruthy();
  });

  it("should convert 255, 255, 255 to #ffffff", () => {
    expect(result).toEqual("#ffffff");
  });
});

describe.concurrent("componentToHex()", () => {
  it("should turn an 8bit number to hex", () => {
    const result = componentToHex(255);
    expect(result).toBe("ff");
  });

  it("should pad with a 0 if the result is less than 10", () => {
    const result = componentToHex(8);
    expect(result).toBe("08");
  });
});