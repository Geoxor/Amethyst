import { PathLike } from "fs";
import { Playlist } from "../playlist";
import { ALLOWED_AUDIO_EXTENSIONS, ALLOWED_EXTENSIONS, ALLOWED_PLAYLIST_FORMATS, AMETHYST_PLAYLIST_EXTENSION } from "@shared/constants";
import { amethyst } from "@/amethyst";
import fs from "fs";

/** A simple class that contains functions for paths, file input and output */
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

    public static async writeFile(path: PathLike, data: String) {
        fs.promises.writeFile(path, data).catch(error => console.log(error));
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
        if (path.toString().includes(".")) {
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
    // TODO: Playlist support
    public static async redirect(paths: string | string[]) {
        (new Array<PathLike>).concat(paths).forEach(async path => {
            const extension = this.getExtension(path);
            if (extension) {
                if (ALLOWED_AUDIO_EXTENSIONS.includes(extension)) {
                    amethyst.player.queue.add(path.toString());
                } else if (ALLOWED_PLAYLIST_FORMATS.includes(extension)) {
                    // TODO: Open playlist
                } else if (AMETHYST_PLAYLIST_EXTENSION == extension) {
                    // TODO: Open Amethyst playlist
                } else {
                    // TODO: Default operation
                }
            } else {
                if ((await fs.promises.stat(path)).isDirectory()) {
                    console.log("is dir");
                }
                // TODO: path with no extensions (possibly folder)
            }
        });
    }
}