// This file contains all Tauri specific implementations that are detached from rest of the code.
import { platform } from '@tauri-apps/api/os';

import { join, appDataDir } from '@tauri-apps/api/path';
import { readBinaryFile, writeBinaryFile, readDir, createDir, writeTextFile, readTextFile, removeFile, exists, BaseDirectory } from '@tauri-apps/api/fs';

import * as mm from "music-metadata-browser";
import { IMetadata } from "@shared/types";

// TODO: instead of having this utility class, we'll create a "dummy" Electron RPC wrapper that re-routes everything where they belong,
// allowing us to hook onto it, whenever Tauri is in use to make developing new features easier.
class TauriUtils {
    // stub
    constructor() { }

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

    public tauriGetFilename(path: String)
    {
        // TODO: better way of doing this?
        const nameWithExtension = path.substring(path.lastIndexOf('/') + 1);
        return nameWithExtension.substring(0, nameWithExtension.lastIndexOf('.'));
    }

    public async tauriStat(path: String)
    {
        return await exists(path);
    }

    public async tauriCreateFolder(path: String)
    {
        await createDir(path, {
            recursive: true
        });
    }

    public async tauriReadFolder(path: String)
    {
        return await readDir(path, {
            recursive: true
        });
    }

    public async tauriFetch(path: String)
    {
        return await readTextFile(path);
    }

    public async tauriDelete(path: String)
    {
        return await removeFile(path);
    }

    public async tauriWrite(path: String, content: String)
    {
        return await writeTextFile(path, content);
    }

    public async tauriJoin(strings: String[])
    {
        return await join(strings);
    }

    public async tauriGetDataDir()
    {
        return await appDataDir();
    }
}

export const tauriUtils = new TauriUtils();