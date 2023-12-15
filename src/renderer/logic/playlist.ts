import { Track } from "./track";

export class Playlist{
    public list: Track[];

    public constructor(tracks?: Track[]){
        tracks ? this.list = Array.from(tracks) : this.list = new Array<Track>;
    }

    public getTracks(): Track[]{
        return this.list;
    }
}