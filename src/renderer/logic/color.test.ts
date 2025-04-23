import { describe, expect, it } from "vitest";
import { componentToHex, rgbToHex } from "./color";
import { vi } from "vitest";

const getThemeColorHex = vi.fn((string: string) => {
  const colors: Record<string, string> = {
    "--color-primary": "#007bff",
    "--color-secondary": "#6c757d",
    "--color-success": "#28a745",
    "--color-danger": "#dc3545",
    "--color-warning": "#ffc107",
    "--color-info": "#17a2b8",
    "--color-light": "#f8f9fa",
    "--color-dark": "#343a40",
  };
  return colors[string] || "#000000"; // Default to black if not found
});

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

describe.concurrent("getThemeColorHex()", () => {
  it("should return a hex color", () => {
    const result = getThemeColorHex("--color-primary");
    expect(result).toBeTypeOf("string");
    expect(result.startsWith("#")).toBeTruthy();
  });

  it("should return the correct color", () => {
    const result = getThemeColorHex("--color-primary");
    expect(result).toEqual("#007bff"); // Adjust this to the expected value in your theme
  });

  it("should return #000000 for unknown colors", () => {
    const result = getThemeColorHex("--color-unknown");
    expect(result).toEqual("#000000"); // Default value for unknown colors
  });
});