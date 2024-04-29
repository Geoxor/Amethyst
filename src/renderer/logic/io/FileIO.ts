import { PathLike } from "fs";
import { ALLOWED_AUDIO_EXTENSIONS, ALLOWED_EXTENSIONS, ALLOWED_PLAYLIST_FORMATS, AMETHYST_PLAYLIST_EXTENSION } from "@shared/constants";
import { amethyst } from "@/amethyst";

/** A simple class that contains functions for paths, file input and output */
export abstract class FileIO {

    public static async writeFile(path: PathLike, data: String) {
        window.fs.writeFile(path, data).catch(error => undefined);
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
    public static redirect(paths: string | string[]) {
        (new Array<string>).concat(paths).forEach(async path => {
            try {
                (await window.fs.readdir(path)).forEach(dir => this.redirect(paths.toString() + "\\" + dir));
            } catch {
                const extension = this.getExtension(path);
                if (extension) {
                    if (ALLOWED_AUDIO_EXTENSIONS.includes(extension)) {
                        amethyst.player.queue.add(paths.toString());
                    } else if (ALLOWED_PLAYLIST_FORMATS.includes(extension)) {
                        // TODO: Open playlist
                    } else if (AMETHYST_PLAYLIST_EXTENSION == extension) {
                        // TODO: Open Amethyst playlist
                    } else {
                        // TODO: Default operation
                    }
                }
            }
        });
    }
}