export const getLogIndex = (value: number, min: number, max: number) => {
  const exp = value / min / (max - min);
  return min * (max / min) ** exp;
};

export const scaleLog = (array: Uint8Array): Uint8Array => {
  const logArray = [];

  for (let i = 1; i < array.length - 1; i++) {
    const idx = getLogIndex(i, 1, array.length - 1);
    const low = ~~idx;
    const high = Math.ceil(idx);
    const lv = array[low];
    const hv = array[high];
    const w = (idx - low) / (high - low);
    const v = lv + (hv - lv) * w;
    logArray.push(v);
  }

  return new Uint8Array(logArray);
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

export const interpolateArray = <T>(data: T[], fitCount: number): T[] => {
  const linearInterpolate = function (before: any, after: any, atPoint: number) {
    return before + (after - before) * atPoint;
  };

  const newData = [];
  const springFactor = (data.length - 1) / (fitCount - 1);

  newData[0] = data[0]; // for new allocation

  for (let i = 1; i < fitCount - 1; i++) {
    const tmp = i * springFactor;
    const before = ~~Math.floor(tmp);
    const after = ~~Math.ceil(tmp);
    const atPoint = tmp - before;
    newData[i] = linearInterpolate(data[before], data[after], atPoint);
  }
  newData[fitCount - 1] = data[data.length - 1]; // for new allocation

  return newData;
};

export const percentToLog = (percentage: number, min: number, max: number) => {
  const minp = 0;
  const maxp = 100;

  const minv = Math.log(min);
  const maxv = Math.log(max);

  // calculate adjustment factor
  const scale = (maxv - minv) / (maxp - minp);

  return Math.exp(minv + scale * (percentage - minp));
};

export const infinityClamp = (num: number, min: number) => Number.isFinite(num) ? num : min;

export const computeWidthPercentage = (min: number, max: number, value: number): number => {
  if (value < min) return 0; // if below threashold don't default to 100
  if (value > max) return 100; // if above 0 LUFs default to 100
  return ((value - min) / (max - min)) * 100;
};
