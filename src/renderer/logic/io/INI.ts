import fs from "fs";
import { PathLike } from "fs";

/** A class used to handle files formatted in INI */
export class Entry {
    public section?: string;
    public key?: string;
    public value?: string;

    public Entry(section?: string, key?: string, value?: string) {
        this.section = section;
        this.key = key;
        this.value = value;
    }
}

export class INI {

    private static readonly SECTION_LIMITER: string[] = ["[", "]"];
    private static readonly KEY_VALUE_SEPARATOR: string = "=";

    public static readSection(path: PathLike, section: string): Entry[] | undefined {
        const inputStream = fs.createReadStream(path);
        const result = new Array<Entry>;
        inputStream.forEach(char => {

        });
        return;
    }

    public static readFile(path: PathLike): Entry[] | undefined {
        const inputStream = fs.createReadStream(path);
        const result = new Array<Entry>;
        let currentSection: string = "";
        let cache: string = "";
        inputStream.forEach(buffer => {
            if(buffer == this.SECTION_LIMITER[0]) {
                cache = "";
            }else if(buffer == this.SECTION_LIMITER[1]) {
                currentSection = cache;
                cache = "";
            }else {
                
            }
            cache = cache.concat(buffer);
        }).finally(() => {
            inputStream.close();
        });
        return;
    }
}
