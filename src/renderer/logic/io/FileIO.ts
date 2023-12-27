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
            for (const s in split) {
                newPath = newPath.concat(s);
            }
        } else {
            newPath = path.toString().concat(".", newExtension);
        }
        return newPath;
    }
}

export abstract class PlaylistFileType {
    public abstract unpack(data: string): Playlist;
    public abstract pack(playlist: Playlist): string;

    protected static registered: Map<string, typeof PlaylistFileType> = new Map();

    protected static register(extension: string, type: typeof PlaylistFileType) {
        this.registered.set(extension, type);
    }

    protected static registerAll(extensions: string[], type: typeof PlaylistFileType) {
        for (const extension in extensions) {
            this.register(extension, type);
        }
    }

    public static forExtension(extension: PathLike): typeof PlaylistFileType | undefined {
        return this.registered.get(extension.toString().toLowerCase());
    }
}

export class XML {

}

export class INI {

}

export class ASX extends PlaylistFileType {
    static {
        super.register("asx", this);
    }
    public unpack(data: string): Playlist {
        throw new Error("Method not implemented.");
    }
    public pack(playlist: Playlist): string {
        throw new Error("Method not implemented.");
    }
}

export class XSPF extends PlaylistFileType {
    static {
        super.register("xspf", this);
    }
    public unpack(data: string): Playlist {
        throw new Error("Method not implemented.");
    }
    public pack(playlist: Playlist): string {
        throw new Error("Method not implemented.");
    }
}

export class M3U extends PlaylistFileType{
    static {
        super.registerAll(["m3u", "m3u8"], this);
    }
    public unpack(data: string): Playlist {
        throw new Error("Method not implemented.");
    }
    public pack(playlist: Playlist): string {
        throw new Error("Method not implemented.");
    }
}

export class AmethystPlaylistFile extends PlaylistFileType {
    static {
        super.register(AMETHYST_PLAYLIST_EXTENSION, this);
    }
    public unpack(data: string): Playlist {
        throw new Error("Method not implemented.");
    }
    public pack(playlist: Playlist): string {
        throw new Error("Method not implemented.");
    }
}