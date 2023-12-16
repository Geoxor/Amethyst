// This file contains all Tauri specific implementations that are detached from rest of the code.
import { platform } from '@tauri-apps/api/os';
import { readBinaryFile, writeBinaryFile, readDir, BaseDirectory } from '@tauri-apps/api/fs';

import * as mm from "music-metadata-browser";
import { IMetadata } from "@shared/types";

class TauriUtils {
    constructor() {
        console.log('Tauri util class init?');
    }

    public async loadMetadata(path: String)
    {
        const buffer = await readBinaryFile(path);
        const {format, common} = await mm.parseBuffer(buffer, undefined);
        const size = buffer.length;
        return {format, common, size } as IMetadata;
    }

    public async loadCover(path: String)
    {
        const buffer = await readBinaryFile(path);
        const {common} = await mm.parseBuffer(buffer, undefined);
        if (common.picture) {
        return common.picture[0].data.toString("base64") as string;
        }
        return;
    }
}

export const tauriUtils = new TauriUtils();