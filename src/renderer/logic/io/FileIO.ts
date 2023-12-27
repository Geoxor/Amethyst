import { PathLike } from "fs";
import { Playlist } from "../playlist";

export abstract class FileIO {

    public static writePlaylist(playlist: Playlist, path: PathLike, overwrite: boolean = false): boolean {
        return false;
    }

    public static readPlaylist(path: PathLike): Playlist | undefined {
        return undefined;
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