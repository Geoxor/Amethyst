import { AMETHYST_PLAYLIST_EXTENSION } from "@shared/constants";
import { Playlist } from "../playlist";
import { PathLike } from "fs";

/** A simple abstract class that is used to read/write playlist files with specific formatting through defined subclasses */
export abstract class PlaylistFileType {

    /**
     * Constructs a playlist instance with the given data if possible
     * @param data the data used to represent a playlist in a specific format
     * @returns a playlist instance from the given data if possible, undefined otherwise
     */
    public static unpack(data: string): Playlist | undefined {
        throw new Error("Method not implemented.");
    }

    /**
     * Constructs a string that represents a playlist in a specific format. Used for storage
     * @param playlist the playlist which should be converted into a specific format
     */
    public static pack(playlist: Playlist): string {
        throw new Error("Method not implemented.");
    }
    
    /** Maps file extensions to a subclass that is needed for input/output */
    protected static registered: Map<string, typeof PlaylistFileType> = new Map<string, typeof PlaylistFileType>();
    
    /**
     * Registers a file extension to a subclass
     * @param extension the file extension supported by the subclass
     * @param type the subclass as a type
     */
    public static register(extension: string, type: typeof PlaylistFileType) {
        this.registered.set(extension.replaceAll(".", ""), type);
    }
    
    /**
     * Registers files extensions to a subclass
     * @param extensions the file extensions supported by the subclass
     * @param type the subclass as a type
     */
    public static registerAll(extensions: string[], type: typeof PlaylistFileType) {
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
export abstract class ASX extends PlaylistFileType {
    public unpack(data: string): Playlist | undefined {
        throw new Error("Method not implemented.");
    }
    public pack(playlist: Playlist): string {
        throw new Error("Method not implemented.");
    }
}

/** A class that can read and write .xspf (XML) files */
export abstract class XSPF extends PlaylistFileType {
    public unpack(data: string): Playlist | undefined {
        throw new Error("Method not implemented.");
    }
    public pack(playlist: Playlist): string {
        throw new Error("Method not implemented.");
    }
}

/** A class that can read and write .m3u and m3u8 (Plain Text) files */
export abstract class M3U extends PlaylistFileType {
    public unpack(data: string): Playlist | undefined {
        throw new Error("Method not implemented.");
    }
    public pack(playlist: Playlist): string {
        throw new Error("Method not implemented.");
    }
}

/** A class that can read and write .pls (INI) files */
export abstract class PLS extends PlaylistFileType {
    public unpack(data: string): Playlist | undefined {
        throw new Error("Method not implemented.");
    }
    public pack(playlist: Playlist): string {
        throw new Error("Method not implemented.");
    }
}

/** A class that can read and write files formatted in the Amethyst playlist format */
export abstract class AmethystPlaylistFile extends PlaylistFileType {
    public unpack(data: string): Playlist | undefined {
        throw new Error("Method not implemented.");
    }
    public pack(playlist: Playlist): string {
        throw new Error("Method not implemented.");
    }
}

PlaylistFileType.register("asx", ASX);
PlaylistFileType.register("xspf", XSPF);
PlaylistFileType.registerAll(["m3u", "m3u8", "vlc"], M3U);
PlaylistFileType.register("pls", PLS);
PlaylistFileType.register(AMETHYST_PLAYLIST_EXTENSION, AmethystPlaylistFile);