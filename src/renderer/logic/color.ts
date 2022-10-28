export const componentToHex = (c: number) => {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};

export const rgbToHex = (r: string | number, g: string | number, b: string | number) => {
  r = typeof r == "string" ? parseFloat(r) : r;
  g = typeof g == "string" ? parseFloat(g) : g;
  b = typeof b == "string" ? parseFloat(b) : b;
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

export const getThemeColorHex = (variableName: string) => {
  const [r, g, b] = getComputedStyle(document.documentElement).getPropertyValue(variableName).split(", ");
  return rgbToHex(r, g, b);
};
