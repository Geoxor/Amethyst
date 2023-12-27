export const AMETHYST_PLAYLIST_EXTENSION = "apl"; // Amethyst Playlist File
export enum ALBUM_TYPE {SINGLE, EP};

export const ALLOWED_PLAYLIST_FORMATS = [
  "asx", // XML
  "xspf", // XML
  "m3u", // Plain Text
  "m3u8", // Plain Text as well
  "vlc", // renamed m3u8
  "pls", // INI
  AMETHYST_PLAYLIST_EXTENSION,
];

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
  "webm",
].concat(ALLOWED_PLAYLIST_FORMATS);