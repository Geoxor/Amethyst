export const getLogIndex = (value: number, min: number, max: number) => {
  const exp = value / min / (max - min);
  return min * (max / min) ** exp;
};

export const scaleLog = (array: Uint8Array): Uint8Array => {
  const logArray = [];

  for (let i = 1; i < array.length - 2; i++) {
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
}

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
}