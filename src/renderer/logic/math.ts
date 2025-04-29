export const getLogIndex = (value: number, min: number, max: number) => {
  const exp = value / min / (max - min);
  return min * (max / min) ** exp;
};

export const normalize8bit = (value: number): number => {
  return Math.max(0, Math.min(255, value)) / 255;
};

export const logParabolicSpectrum = (
  dataArray: Uint8Array,
  outputLength: number
): Float32Array => {
  const maxIndex = dataArray.length - 1;
  const result = new Float32Array(outputLength);

  for (let i = 0; i < outputLength; i++) {
    // logarithmic virtual index
    const logIndex = Math.pow(maxIndex, i / (outputLength - 1));

    // floor to get base index, get fraction for interpolation
    const base = Math.floor(logIndex);
    const t = logIndex - base;

    // get 3 y values for interpolation
    const y0 = dataArray[Math.max(base - 1, 0)];
    const y1 = dataArray[base];
    const y2 = dataArray[Math.min(base + 1, maxIndex)];

    // parabolic interpolation
    const a = (y0 - 2 * y1 + y2) / 2;
    const b = (y2 - y0) / 2;
    const c = y1;

    const y = a * t * t + b * t + c;

    result[i] = y;
  }

  return result;
};

/**
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 * Fast shuffle method
 * @param array 
 * @returns array
 */
export const fisherYatesShuffle = <T>(array: T[]): T[] => {
  let m = array.length; let t; let i;
  while (m) {
    i = ~~(Math.random() * m--);

    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
};

/**
 * Turn's an array of arrays into a flat array of all items
 * @param array 
 * @returns array
 */
export const flattenArray = <T>(array: T[]): T[] => {
  return array.reduce((acc, item) => {
    if (Array.isArray(item))
      return acc.concat(flattenArray(item));
    else
      return acc.concat(item);
  }, [] as T[]);
};

export const percentToLogValue = (percentage: number, min: number, max: number) => {
  const minp = 0;
  const maxp = 100;

  const minv = Math.log(min);
  const maxv = Math.log(max);

  // calculate adjustment factor
  const scale = (maxv - minv) / (maxp - minp);

  return Math.exp(minv + scale * (percentage - minp));
};

export const logValueToPercentage = (value: number, min: number, max: number): number => {
  const minp = 0;
  const maxp = 100;

  const minv = Math.log(min);
  const maxv = Math.log(max);

  // calculate adjustment factor
  const scale = (maxp - minp) / (maxv - minv);

  return ((Math.log(value) - minv) * scale + minp);
};

export const infinityClamp = (num: number, min: number) => Number.isFinite(num) ? num : min;

export const computeWidthPercentage = (min: number, max: number, value: number): number => {
  if (value < min) return 0; // if below threashold don't default to 100
  if (value > max) return 100; // if above 0 LUFs default to 100
  return ((value - min) / (max - min)) * 100;
};

export const floatToInt16 = (float32Array: Float32Array) => {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i])); // clip to -1..1
    int16Array[i] = s < 0 ? s * 32768 : s * 32767;
  }
  return int16Array;
};