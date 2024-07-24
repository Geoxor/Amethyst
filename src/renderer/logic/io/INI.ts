/** A class used to handle files formatted in INI */
export class Entry {
    public key: string;
    public value: string;

    public constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }
}

export class INI {

    private static readonly SECTION_LIMITER: string[] = ["[", "]"];
    private static readonly COMMENT: string = "#";
    private static readonly KEY_VALUE_SEPARATOR: string = "=";

    public static async parseINI(path: string): Promise<Map<string, Entry[]>> {
        const input = await window.fs.readFile(path);
        const result = new Map<string, Entry[]>;
        let section: string = "";
        const cache: Entry[] = new Array<Entry>();
        let line: String = "";
        
        for (const character in input) {
            if(character != "\n") {
                line = line.concat(character);
            } else {
                line = line.trim().split(this.COMMENT)[0];
                if(line == "") continue;
                if(line.startsWith(this.SECTION_LIMITER[0]) && line.endsWith(this.SECTION_LIMITER[1])) {
                    if(section != "" && cache.length > 0) {
                        result.set(section, cache);
                    }
                    section = line.substring(this.SECTION_LIMITER[0].length, line.length - this.SECTION_LIMITER[1].length);
                    if(section == "") {
                        throw new ReferenceError("Section name is empty");
                    }
                } else {
                    if(section == "") {
                        throw new ReferenceError("Line is not part of a section");
                    }
                    const entry: Entry = new Entry(line.substring(0, line.indexOf(this.KEY_VALUE_SEPARATOR)), line.substring(line.indexOf(this.KEY_VALUE_SEPARATOR) + 1));
                    if(entry.key == "") throw new ReferenceError("Line does not contain a valid key");
                    cache.push(entry);
                }
            }
        }
        return new Promise<Map<string, Entry[]>>(resolve => {
            resolve(result);
        });
    }
}
