import type { Player } from "@/logic/player.js";

export class MediaSession {
  public constructor(private player: Player) {
    this.setActionHandlers();
    this.setEventListeners();
  }

  private setActionHandlers() {
    if (!("mediaSession" in navigator)) return console.warn("Media Session API not supported");

    navigator.mediaSession.setActionHandler("play", () => this.player.play());
    navigator.mediaSession.setActionHandler("pause", () => this.player.pause());
    navigator.mediaSession.setActionHandler("previoustrack", () => this.player.previous());
    navigator.mediaSession.setActionHandler("nexttrack", () => this.player.skip());
    navigator.mediaSession.setActionHandler("seekbackward", details => { this.player.seekBackward(details.seekOffset || undefined); });
    navigator.mediaSession.setActionHandler("seekforward", details => { this.player.seekForward(details.seekOffset || undefined); });
    navigator.mediaSession.setActionHandler("seekto", details => { details.seekTime && this.player.seekTo(details.seekTime); });
    navigator.mediaSession.setActionHandler("stop", () => this.player.stop());
  }

  private setEventListeners() {
    this.player.on("player:resume", () => navigator.mediaSession.playbackState = "playing");
    this.player.on("player:pause", () => navigator.mediaSession.playbackState = "paused");
    this.player.on("player:seek", ({track, seekedTo}) => this.updatePositionState(track.getDuration(), seekedTo));
    this.player.on("player:pitchChange", ({track}) => this.updatePositionState(track?.getDuration()));
    this.player.on("player:trackChange", async track => {
      const coverUrl = track.getCover();
      if (!coverUrl) return;

      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.getTitleFormatted(),
        artist: track.getArtistsFormatted(),
        album: track.getAlbum(),
        artwork: [{ src: coverUrl, type: "" }],
      });

      this.updatePositionState(track.getDuration());
    });
  }

  private updatePositionState(duration?: number, position: number = 0) {
    if (!duration) return;
    navigator.mediaSession.setPositionState({ duration, playbackRate: this.player.input.playbackRate, position});
  };
}
