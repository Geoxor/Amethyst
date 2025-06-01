import fs from "fs";
import * as mm from "music-metadata";

import type { IMetadata } from "../shared/types.js";

export class Metadata {
  public static async getMetadata(path?: string): Promise<IMetadata | undefined> {
    if (!path) return;
    const file = await fs.promises.readFile(path);
    const { common, format } = await mm.parseBuffer(file);
    return { common, format, size: file.buffer.byteLength };
  }
}
