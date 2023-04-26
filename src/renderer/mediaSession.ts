
export class MediaSession {
  public constructor() {
    const actionHandlers: ([MediaSessionAction, MediaSessionActionHandler])[] = [
      ["play", () => amethyst.player.isPlaying.value ? amethyst.player.pause() : amethyst.player.play()],
      ["pause", () => !amethyst.player.isPlaying.value ? amethyst.player.play() : amethyst.player.pause()],
      ["previoustrack", () => amethyst.player.previous()],
      ["nexttrack", () => amethyst.player.skip()],
      ["seekbackward", details => { amethyst.player.seekBackward(details.seekOffset || undefined); }],
      ["seekforward", details => { amethyst.player.seekForward(details.seekOffset || undefined); }],
      ["seekto", details => { details.seekTime && amethyst.player.seekTo(details.seekTime); }],
      ["stop", () => amethyst.player.stop()],
    ];

    for (const [action, handler] of actionHandlers) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch (error) {
        console.error(`The media session action "${action}" is not supported yet.`);
      }
    }

    amethyst.player.on("play", () => navigator.mediaSession.playbackState = "playing");
    amethyst.player.on("pause", () => navigator.mediaSession.playbackState = "paused");

    amethyst.player.on("play", track => {
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
