import { PathLike } from "fs";
import { Track } from "./track";
import { ref } from "vue";

export class Playlist{
    public list = new Array<Track>;
    public name = ref(new String("Playlist"));

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