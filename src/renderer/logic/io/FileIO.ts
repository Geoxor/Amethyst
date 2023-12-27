import { PathLike } from "fs";
import { Playlist } from "../playlist";
import { ALLOWED_AUDIO_EXTENSIONS } from "@shared/constants";

export abstract class FileIO {

    public static writePlaylist(playlist: Playlist, path: PathLike, overwrite: boolean = false): boolean {
        return false;
    }

    public static readPlaylist(path: PathLike): Playlist | undefined {
        return undefined;
    }

    public static extensionAllowed(path: PathLike): boolean {
        const split = path.toString().split(".");
        const extension = split[split.length - 1];
        return ALLOWED_AUDIO_EXTENSIONS.includes(extension);
    }

    public static replaceExtension(path: PathLike, newExtension: string): PathLike {
        let newPath = "";
        if (path.toString().includes(".")){
            const split = path.toString().split(".");
            split[split.length - 1] = newExtension;
            for(const s in split) {
                newPath = newPath.concat(s);
            }
        } else {
            newPath = path.toString().concat(".", newExtension);
        }
        return newPath;
    }

}

export abstract class PlaylistFileType {
    //public abstract fromFile(path?: PathLike): Playlist;
    //public abstract toFile(path?: PathLike): boolean;
}

/**
 * A simple class for reading and writing a XML based file.
 */
export class XML {
    private version: number;

    public constructor(path: PathLike) {

    }
}

export class INI {

}

export class ASX extends PlaylistFileType {

}

export class XSPF extends PlaylistFileType {

}

export class M3U extends PlaylistFileType{

}