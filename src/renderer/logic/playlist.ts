import { PathLike } from "fs";
import { Track } from "./track";

export class Playlist{
    public list = new Array<Track>;
    public name = new String("Playlist");
    public path?: String;

    public constructor(tracks?: Track[]){
        tracks && tracks.forEach(track => this.list.push(track));
    }

    public getTracks(): Track[]{
        return this.list;
    }

    public async loadTracks(){

    }

    /**
     * 
     */
    public async loadFromFile(path: PathLike){

    }
}