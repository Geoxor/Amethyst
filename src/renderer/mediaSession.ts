import { Player } from "@/logic/player";

export class MediaSession {
  public constructor(public player: Player) {
    const actionHandlers: ([MediaSessionAction, MediaSessionActionHandler])[] = [
      ["play", () => this.player.isPlaying.value ? this.player.pause() : this.player.play()],
      ["pause", () => !this.player.isPlaying.value ? this.player.play() : this.player.pause()],
      ["previoustrack", () => this.player.previous()],
      ["nexttrack", () => this.player.next()],
      ["seekbackward", details => { this.player.seekBackward(details.seekOffset || undefined); }],
      ["seekforward", details => { this.player.seekForward(details.seekOffset || undefined); }],
      ["seekto", details => { details.seekTime && this.player.seekTo(details.seekTime); }],
      ["stop", () => this.player.stop()],
    ];

    for (const [action, handler] of actionHandlers) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch (error) {
        console.error(`The media session action "${action}" is not supported yet.`);
      }
    }

    this.player.on("play", () => navigator.mediaSession.playbackState = "playing");
    this.player.on("pause", () => navigator.mediaSession.playbackState = "paused");

    this.player.on("play", track => {
      const cover = track.getMetadata()?.common.picture?.[0];
      let coverUrl: string = "";

      cover && (coverUrl = URL.createObjectURL(new Blob([new Uint8Array(cover.data)], { type: "image/png" })));

      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.getTitleFormatted(),
        artist: track.getArtistsFormatted(),
        album: track.getAlbumFormatted(),
        artwork: [{ src: coverUrl, type: "image/png" }],
      });
    });
  }
}
