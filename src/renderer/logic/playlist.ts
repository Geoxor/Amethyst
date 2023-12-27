import { PathLike } from "fs";
import { Track } from "./track";
import { FileIO } from "./io/FileIO";

export class Playlist {
    protected tracks = new Array<Track>;
    protected name = new String("Playlist");
    protected cover: string | undefined;

    public constructor(name?: String, tracks?: Track[]) {
        name && this.name == name;
        tracks && tracks.forEach(track => this.tracks.push(track));
    }

    public getTracks(): Track[] {
        return this.tracks;
    }

    public getName(): String | undefined {
        return this.name;
    }

    /**
     * Saves this playlist instance to a file with a valid extension.
     * If no path is given it will use the path of the instance if available, returns false if both are undefined.
     * If path is directory, it will save the playlist in the custom Amethyst format and the playlist's name in the given directory
     * Returns false if unable to save to file.
     * @param path the path where the file will be stored including the extension if valid
     * @param overwrite if true, it will replace the 
     * @returns true if successful, false if: Track count < 1, invalid/nonexisting/undefined path/extension or due to an IO error
     */
    public saveToFile(path?: PathLike, overwrite: boolean = false): boolean {
        const exportPath = (path) ? path : "";
        return FileIO.writePlaylist(this, exportPath, overwrite);
    }

    /**
     * 
     */
    public async loadFromFile(path: PathLike) {

    }
}