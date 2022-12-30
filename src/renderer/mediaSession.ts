import { player } from "@/logic/player";

export class MediaSession {
  public constructor() {
    const actionHandlers: ([MediaSessionAction, MediaSessionActionHandler])[] = [
      ["play", () => player.isPlaying.value ? player.pause() : player.play()],
      ["pause", () => !player.isPlaying.value ? player.play() : player.pause()],
      ["previoustrack", () => player.previous()],
      ["nexttrack", () => player.skip()],
      ["seekbackward", details => { player.seekBackward(details.seekOffset || undefined); }],
      ["seekforward", details => { player.seekForward(details.seekOffset || undefined); }],
      ["seekto", details => { details.seekTime && player.seekTo(details.seekTime); }],
      ["stop", () => player.stop()],
    ];

    for (const [action, handler] of actionHandlers) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch (error) {
        console.error(`The media session action "${action}" is not supported yet.`);
      }
    }

    player.on("play", () => navigator.mediaSession.playbackState = "playing");
    player.on("pause", () => navigator.mediaSession.playbackState = "paused");

    player.on("play", track => {
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
