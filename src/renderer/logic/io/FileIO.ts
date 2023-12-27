import { amethyst } from "@/amethyst";
import * as FS from "fs";

export abstract class FileIO {
    
    public static async readFile(path: string): Promise<string | Buffer>{
        switch (amethyst.getCurrentPlatform()) {
            case "desktop":
                return window.fs.readFile(path);
            default:
                return Promise.reject();
        }
    }

    public static async writeFile(path: string, data: string | Buffer){
        switch (amethyst.getCurrentPlatform()) {
            case "desktop":
                return window.fs.writeFile(path, data);
            default:
                return Promise.reject();
        }
    }

    public static readFileSync(path: string): String | Buffer | null{
        switch (amethyst.getCurrentPlatform()) {
            case "desktop":
                return FS.readFileSync(path);
            default:
                return null;
        }
    }

    public static writeFileSync(path: string, data: string | Buffer){
        switch (amethyst.getCurrentPlatform()) {
            case "desktop":
                return FS.writeFileSync(path, data);
            default:
                return Promise.reject();
        }
    }

    public static writePlaylist(fileType: PlaylistFileType) {
        
    }

}

export abstract class PlaylistFileType {
    //public abstract fromFile(path?: FS.PathLike): PlaylistFileType;
    //public abstract toFile(path?: FS.PathLike): boolean;
}

/**
 * A simple class for reading and writing a XML based file.
 */
export class XML {

}

export class INI {

}

export class ASX extends PlaylistFileType {

}

export class XSPF extends PlaylistFileType {

}

export class M3U extends PlaylistFileType{

}