import { amethyst } from "@/amethyst";
import * as FS from "fs";

export abstract class FileIO{
    
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
}