/** The file type mainly used for playlists */
export enum FILE_TYPE {XML, INI, M3U8};

/** The file extension for Amethyst's own playlist format */
export const AMETHYST_PLAYLIST_EXTENSION = "ampf";

/** The configuration for Amethyst's own playlist format used to configure the file structure (XML, M3U, INI, etc.) */
export const AMETHYST_PLAYLIST_FILE : {extension: string, fileType: FILE_TYPE} = {extension: AMETHYST_PLAYLIST_EXTENSION, fileType: FILE_TYPE.M3U8};

/** The type of an album */
export enum ALBUM_TYPE {SINGLE, EP};

/** The supported playlist formats */
export const ALLOWED_PLAYLIST_FORMATS = [
  "asx", // XML
  "xspf", // XML
  "m3u", // Plain Text
  "m3u8", // Plain Text
  "vlc", // renamed m3u8
  "pls", // INI
  AMETHYST_PLAYLIST_EXTENSION
];

/** The supported audio file extensions */
export const ALLOWED_AUDIO_EXTENSIONS = [
  "ogg",
  "ogv",
  "oga",
  "ogx",
  "ogm",
  "spx",
  "opus",
  "wav",
  "wave",
  "m4a",
  "m4b",
  "m4p",
  "m4r",
  "m4v",
  "3gp",
  "flac",
  "opus",
  "aac",
  "aiff",
  "mp3",
  "m4a",
  "mp4",
  "dfpwm",
  "webm"
];

/** All defined extensions, used for importing with file extension filters */
export const ALLOWED_EXTENSIONS = [
  AMETHYST_PLAYLIST_EXTENSION
].concat(ALLOWED_AUDIO_EXTENSIONS).concat(ALLOWED_PLAYLIST_FORMATS);