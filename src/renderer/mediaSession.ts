import Player from "./player";
export default class MediaSession {
  public constructor(public player: Player) {
    const actionHandlers: ([MediaSessionAction, MediaSessionActionHandler])[] = [
      ['play',          () => { 
        this.player.isPlaying() ? this.player.pause() : this.player.play();
      }],
      ['pause',         () => { 
        !this.player.isPlaying() ? this.player.play() : this.player.pause();
      }],
      ['previoustrack', () => {  
        this.player.previous();
      }],
      ['nexttrack',     () => { 
        this.player.next();
      }],
      ['stop',          () => { 
        this.player.pause();
        this.player.setCurrentlyPlayingIndex(0);
      }],
      ['seekbackward',  (details) => { this.player.seekBackward(details.seekOffset || undefined) }],
      ['seekforward',   (details) => { this.player.seekForward(details.seekOffset || undefined) }],
      ['seekto',        (details) => { details.seekTime && this.player.seekTo(details.seekTime) }],
    ];
    
    for (const [action, handler] of actionHandlers) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch (error) {
        console.log(`The media session action "${action}" is not supported yet.`);
      }
    }

    this.player.on("play", () => {
      navigator.mediaSession.playbackState = "playing";
    })

    this.player.on("pause", () => {
      navigator.mediaSession.playbackState = "paused";
    })

    this.player.on("metadata", meta => {
      const cover = meta?.common?.picture?.[0];
      let coverUrl: string = "";

      if (cover) {
        const coverBlob = new Blob([
          new Uint8Array(cover.data, 0, cover.data.byteLength)
        ], { type: "image/png" });
        coverUrl = URL.createObjectURL(coverBlob);
      }


      navigator.mediaSession.metadata = new MediaMetadata({
        title: meta.common.title,
        artist: meta.common.artists?.join(" & "),
        album: meta.common.album,
        artwork: [{ src: coverUrl, type: 'image/png' }],
      });
    });
  }
}
