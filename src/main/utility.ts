import { createHash } from "node:crypto";

import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const md5 = (data: string) => {
  return createHash("md5")
    .update(data)
    .digest("hex");
};
