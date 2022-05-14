import * as mm from 'music-metadata/lib/core';
import type { IAudioMetadata } from 'music-metadata/lib';
import fs from 'fs';

export default class MusicParser {
  public static async parse(file: string): Promise<IAudioMetadata> {
    const buffer = fs.readFileSync(file);
    return mm.parseBuffer(buffer);
  }

  public static async readDirectory(dir: string): Promise<string[]> {
    return fs.readdirSync(dir);
  }

  public static async loadMusic(dir: string): Promise<IAudioMetadata[]> {
    const files = await this.readDirectory(dir);
    const music = await Promise.all(
      files.map(async (file) => {
        const path = `${dir}/${file}`;
        return mm.parseBuffer(fs.readFileSync(path));
      })
    );
    return music;
  }
}
