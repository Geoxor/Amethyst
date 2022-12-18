import prettyMilliseconds from "pretty-ms";

// recursively goes through every file in the folder and flattens it
export const bytesToHuman = (bytes: number): string => {
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  if (bytes === 0)
    return "0 B";
  const i = ~~(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};

export const bitsToHuman = (bits: number): string => {
  const sizes = ["bps", "Kbps", "Mbps", "Gbps", "Tbps"];
  if (bits === 0)
    return "0 bps";
  const i = ~~(Math.log(bits) / Math.log(1024));
  return `${parseFloat((bits / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};

// Turns seconds from 80 to 1:20
export const secondsToHuman = (time: number): string => {
  return prettyMilliseconds(time * 1000,{secondsDecimalDigits: 0});
};

export const secondsToColinHuman = (time: number): string => {
  const seconds = ~~time;
  const minutes = ~~(seconds / 60);
  const secondsLeft = seconds % 60;
  return `${minutes || 0}:${secondsLeft < 10 ? "0" : ""}${secondsLeft || 0}`;
};