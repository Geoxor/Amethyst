import { PathLike } from "fs";
import { Playlist } from "../playlist";
import { ALLOWED_AUDIO_EXTENSIONS, AMETHYST_PLAYLIST_EXTENSION } from "@shared/constants";

export abstract class FileIO {

    public static writePlaylist(playlist: Playlist, path: PathLike, overwrite: boolean): boolean {
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
    public abstract EXTENSION:string[];
    public abstract unpack(data: string): Playlist;
    public abstract pack(playlist: Playlist): string;

    public static forExtension(extension: PathLike): PlaylistFileType {
        return ASX;
    }
}

export class XML {

}

export class INI {

}

export class ASX extends PlaylistFileType {
    public EXTENSION: string[] = ["asx"];
    public unpack(data: string): Playlist {
        throw new Error("Method not implemented.");
    }
    public pack(playlist: Playlist): string {
        throw new Error("Method not implemented.");
    }
}

export class XSPF extends PlaylistFileType {
    public EXTENSION: string[] = ["xspf"];
    public unpack(data: string): Playlist {
        throw new Error("Method not implemented.");
    }
    public pack(playlist: Playlist): string {
        throw new Error("Method not implemented.");
    }
}

export class M3U extends PlaylistFileType{
    public EXTENSION: string[] = ["m3u", "m3u8"];
    public unpack(data: string): Playlist {
        throw new Error("Method not implemented.");
    }
    public pack(playlist: Playlist): string {
        throw new Error("Method not implemented.");
    }
}

export class AmethystPlaylistFile extends PlaylistFileType {
    public EXTENSION: string[] = [AMETHYST_PLAYLIST_EXTENSION];
    public unpack(data: string): Playlist {
        throw new Error("Method not implemented.");
    }
    public pack(playlist: Playlist): string {
        throw new Error("Method not implemented.");
    }
}