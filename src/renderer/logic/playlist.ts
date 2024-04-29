import { PathLike } from "fs";
import { Track } from "./track";
import { FileIO } from "./io/FileIO";
import { PlaylistFileType } from "./io/Playlists";
import { AMETHYST_PLAYLIST_EXTENSION } from "@shared/constants";
import { amethyst } from "@/amethyst";

export class Playlist {
    protected tracks = new Array<Track>;
    protected name = "Playlist";
    protected cover: string | undefined;

    public constructor(name?: string, tracks?: Track[]) {
        name && this.name == name;
        tracks && tracks.forEach(track => this.tracks.push(track));
    }

    public getTracks(): Track[] {
        return this.tracks;
    }

    public getName(): string | undefined {
        return this.name;
    }

    /**
     * Saves this playlist instance to a file with a valid extension.
     * If no path is given it will use the path of the instance if available, returns false if both are undefined.
     * If path is directory, it will save the playlist in the custom Amethyst format and the playlist's name in the given directory
     * Returns false if unable to save to file.
     * @param path the path where the file will be stored including the extension if valid
     * @param fallback if true, any invalid extension will fall back to the Amethyst playlist extension
     * @returns true if successful, false if: Track count < 1, invalid/nonexisting/undefined path/extension or due to an IO error
     */
    public saveToFile(path: PathLike, fallback: boolean = true) {
        let exportPath = (path) ? path : window.path.join(amethyst.APPDATA_PATH || "", "/amethyst/Playlists", this.name, ".", AMETHYST_PLAYLIST_EXTENSION);
        if (path && !FileIO.extensionAllowed(path) && fallback) {
            exportPath = FileIO.replaceExtension(path, AMETHYST_PLAYLIST_EXTENSION);
        }
        const extension = FileIO.getExtension(exportPath);
        if(!extension || !FileIO.extensionAllowed(extension)) {
            throw new ReferenceError("Invalid or non-exsiting file extension");
        }
        const writer = PlaylistFileType.forExtension(extension);
        if(!writer) {
            throw new ReferenceError("File extension is not mapped");
        }
        const data = writer.pack(this);
        FileIO.writeFile(exportPath, data);
    }

    /**
     * 
     */
    public static loadFromFile(path: PathLike): Playlist | undefined {
        return undefined; // TODO:
    }
}