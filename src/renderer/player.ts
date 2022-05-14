import { Howl } from 'howler';

export default class Player {
  static playAudio(path: string) {
    const sound = new Howl({
      src: [path],
      html5: true,
      format: ['mp3'],
    });

    sound.play();
  }
}
