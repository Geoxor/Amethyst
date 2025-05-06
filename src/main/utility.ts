import {createHash} from "node:crypto";

export const md5 = (data: string) => {
  return createHash("md5")
    .update(data)
    .digest("hex");
};