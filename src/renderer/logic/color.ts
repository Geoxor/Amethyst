export const componentToHex = (c: number) => {
  if (!c) return;
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};

export const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

export const hexToRgb = (hex: string) => {
  hex = hex.replace(/^#/, "");
  // Parse r, g, b values
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
};

/**
 * Gets a css variable value and returns it as hex color string.
 * @param variableName - The name of the css variable to get (eg: "--color-primary").
 * @returns A string representing the color in hex format (eg: "#ff0000").
 */
export const getThemeColorHex = (variableName: string): string => {
  const [r, g, b] = getThemeColorRgb(variableName);
  return rgbToHex(r, g, b);
};

/**
 * Gets a css variable value and returns it as an array of RGB values.
 * @param variableName The name of the css variable to get (eg: "--color-primary").
 * @returns An array containing the RGB values [r, g, b].
 */
export const getThemeColorRgb = (variableName: string): [number, number, number] => {
  const [r, g, b] = getComputedStyle(document.documentElement).getPropertyValue(variableName).split(", ");
  return [parseInt(r), parseInt(g), parseInt(b)];
};

export const getThemeColor = (variableName: string): { r: number; g: number; b: number } => {
  const [r, g, b] = getThemeColorRgb(variableName);
  return { r, g, b };
};
