import prettyMilliseconds from "pretty-ms";

// recursively goes through every file in the folder and flattens it
export const bytesToHuman = (bytes: number): string => {
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  if (bytes === 0)
    return "0 B";
  const i = ~~(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};

// Turns seconds from 80 to 1:20
export const secondsToHuman = (seconds: number): string => {
  return prettyMilliseconds(seconds * 1000,{secondsDecimalDigits: 0});
};