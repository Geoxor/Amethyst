import type { IAudioMetadata } from "music-metadata";

/**
 * Each playable audio file is an instance of this class
 */
export class Track {
  private constructor(public path: string, public metadata: IAudioMetadata) { /* {...} */ }

  /**
   * Async construction of Track class
   * @param path 
   */
  public static new = async (path: string): Promise<Track> => {
    const self = new this(path, await this.fetchMetadata(path));
    return self;
  };

  /**
   * Gets the metadata for a given song
   * @param path The song file path
   */
  private static fetchMetadata = async (path: string) => {
    return (await import("../amethyst")).useElectron().getMetadata(path);
  };

  /**
   * @returns The filename of a file from the full path
   * @example '02. Daft Punk - Get Lucky.flac'
   */
	public getFilename = () => {
		return this.path.substring(Math.max(this.path.lastIndexOf("\\"), this.path.lastIndexOf("/")) + 1);
	};

  /**
   * @returns The title from metadata and falls back to the filename
   * @example 'Get Lucky' || '02. Daft Punk - Get Lucky.flac'
   */
	public getTitleFormatted = () => {
		return this.metadata.common.title || this.getFilename();
	};

  /**
   * @returns The artist(s) (joined with a '&') from metadata and falls back to 'uknown artist'
   * @example 'Daft Punk', 'Virtual Riot & Panda Eyes' || 'unknown artist',
   */
	public getArtistsFormatted = () => {
		return this.metadata.common.artists?.join(" & ") || "unknown artist";
	};
}