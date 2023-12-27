import { PathLike } from "fs";
import { Playlist } from "../playlist";
import { ALLOWED_AUDIO_EXTENSIONS, ALLOWED_EXTENSIONS, ALLOWED_PLAYLIST_FORMATS, AMETHYST_PLAYLIST_EXTENSION } from "@shared/constants";
import { amethyst } from "@/amethyst";

/** A simple class that contains specific functions for paths, file input and output */
export abstract class FileIO {

    /**
     * This function stores a playlist to a file
     * @param playlist the playlist that should be stored
     * @param path the path where it should be stored at, if invalid, it will use the default path
     * @param overwrite if true, it will overwrite the file with the same name, if present
     * @returns if successful true, false otherwise
     */
    public static writePlaylist(playlist: Playlist, path: PathLike, overwrite: boolean): boolean { // TODO:
        return false;
    }

    /**
     * Returns a playlist stored as a file, or undefined if invalid
     * @param path the path where the a playlist is located
     * @returns a playlist instance if successful, undefined otherwise
     */
    public static readPlaylist(path: PathLike): Playlist | undefined { // TODO:
        return undefined;
    }

    /**
     * Checks if a path contains a valid extension
     * @param path the path that should be checked
     * @param extensions a array of valid extensions, default is ALLOWED_EXTENSIONS defined in constants
     * @returns if path has a valid extension, false otherwise
     */
    public static extensionAllowed(path: PathLike, extensions: string[] = ALLOWED_EXTENSIONS): boolean {
        const extension = this.getExtension(path);
        if (!extension) return false;
        return extensions.includes(extension);
    }

    /**
     * Replaces a file extension with the given extension
     * @param path the path which should be modified
     * @param newExtension the new file extension
     * @returns a new path with the given extension
     */
    public static replaceExtension(path: PathLike, newExtension: string): PathLike {
        let newPath = "";
        if (path.toString().includes(".")){
            const split = path.toString().split(".");
            split[split.length - 1] = newExtension.replaceAll(".", "");
            for (const s in split) {
                newPath = newPath.concat(s);
            }
        } else {
            newPath = path.toString().concat(".", newExtension);
        }
        return newPath;
    }

    /**
     * Simply returns the extension of a given path
     * @param path the path of which the extension is returned
     * @returns the extension of the given path
     */
    public static getExtension(path: PathLike): string | undefined {
        if (path.toString().includes(".")){
            const split = path.toString().split(".");
            return split[split.length - 1].toLowerCase();
        } else {
            return;
        }
    }

    /**
     * Redirects audio files to player queue and playlist files will be added to playlists
     * @param paths the path(s) that should be redirected
     */
    public static async redirect(paths: string | string[]) { // TODO: Playlist support
        Array.from(paths).forEach(path => {
            const extension = this.getExtension(path);
            if (extension) {
                if (ALLOWED_AUDIO_EXTENSIONS.includes(extension)) {
                    amethyst.player.queue.add(path);
                } else if (ALLOWED_PLAYLIST_FORMATS.includes(extension)) {
                    // TODO: Open playlist
                } else if (AMETHYST_PLAYLIST_EXTENSION == extension) {
                    // TODO: Open Amethyst playlist
                } else {
                    // TODO: Default operation
                }
            } else {
                // TODO: path with no extensions (possibly folder)
            }
        });
    }
}

/** A class used to handle files formatted in XML */
export class XML {

}

/** A class used to handle files formatted in INI */
export class INI {

}

/** A simple abstract class that is used to read/write playlist files with specific formatting through defined subclasses */
export abstract class PlaylistFileType {

    /**
     * Constructs a playlist instance with the given data if possible
     * @param data the data used to represent a playlist in a specific format
     * @returns a playlist instance from the given data if possible, undefined otherwise
     */
    public abstract unpack(data: string): Playlist | undefined;

    /**
     * Constructs a string that represents a playlist in a specific format. Used for storage
     * @param playlist the playlist which should be converted into a specific format
     */
    public abstract pack(playlist: Playlist): string;
    
    /** Maps file extensions to a subclass that is needed for input/output */
    protected static registered: Map<string, typeof PlaylistFileType> = new Map();
    
    /**
     * Registers a file extension to a subclass
     * @param extension the file extension supported by the subclass
     * @param type the subclass as a type
     */
    protected static register(extension: string, type: typeof PlaylistFileType) {
        this.registered.set(extension.replaceAll(".", ""), type);
    }
    
    /**
     * Registers files extensions to a subclass
     * @param extensions the file extensions supported by the subclass
     * @param type the subclass as a type
     */
    protected static registerAll(extensions: string[], type: typeof PlaylistFileType) {
        for (const extension in extensions) {
            this.register(extension, type);
        }
    }
    
    /**
     * Retrieves the type needed for a specified extension, or undefined if extension is not registered
     * @param extension the extension of a file
     * @returns the type of a sbuclass needed to handle the given extension
     */
    public static forExtension(extension: PathLike): typeof PlaylistFileType | undefined {
        return this.registered.get(extension.toString().toLowerCase());
    }
}

/** A class that can read and write .asx (XML) files */
export class ASX extends PlaylistFileType {
    static {
        super.register("asx", this);
    }
    public unpack(data: string): Playlist | undefined {
        throw new Error("Method not implemented.");
    }
    public pack(playlist: Playlist): string {
        throw new Error("Method not implemented.");
    }
}

/** A class that can read and write .xspf (XML) files */
export class XSPF extends PlaylistFileType {
    static {
        super.register("xspf", this);
    }
    public unpack(data: string): Playlist | undefined {
        throw new Error("Method not implemented.");
    }
    public pack(playlist: Playlist): string {
        throw new Error("Method not implemented.");
    }
}

/** A class that can read and write .m3u and m3u8 (Plain Text) files */
export class M3U extends PlaylistFileType {
    static {
        super.registerAll(["m3u", "m3u8", "vlc"], this);
    }
    public unpack(data: string): Playlist | undefined {
        throw new Error("Method not implemented.");
    }
    public pack(playlist: Playlist): string {
        throw new Error("Method not implemented.");
    }
}

/** A class that can read and write files formatted in the Amethyst playlist format */
export class AmethystPlaylistFile extends PlaylistFileType {
    static {
        super.register(AMETHYST_PLAYLIST_EXTENSION, this);
    }
    public unpack(data: string): Playlist | undefined {
        throw new Error("Method not implemented.");
    }
    public pack(playlist: Playlist): string {
        throw new Error("Method not implemented.");
    }
}