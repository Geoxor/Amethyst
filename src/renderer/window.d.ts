declare type fs = typeof import("fs");
declare type os = typeof import("os");
declare type path = typeof import("path");

declare global {
  interface Window {
    fs: fs;
    os: os;
    path: path;
  }
}

export { };
