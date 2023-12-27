import { PathLike } from "fs";
import { Playlist } from "./playlist";
import { Track } from "./track";

// Development Paused
export class Album extends Playlist {
    protected releaseDate?: String;
    protected recordLabel?: String;
    protected artists?: String[];

    public constructor(path?: PathLike, name?: String, tracks?: Track[], releaseDate: String) {
        super(path, name, tracks);
        this.releaseDate = releaseDate;
        this.recordLabel;
    }

}