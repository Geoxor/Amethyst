import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";
import { AudioContext } from "standardized-audio-context-mock";

import {Track} from "../logic/track";
import fs from "fs";
import * as mm from "music-metadata/lib/core";

const mockResource = (path: string) => `./src/renderer/mocks/${path}`;
vi.stubGlobal("AudioContext", AudioContext);
vi.stubGlobal("Audio", vi.fn(() => ({
  pause: vi.fn(),
  play: vi.fn(),
  addEventListener: vi.fn()
})));
vi.stubGlobal("electron", {
  ipcRenderer: {
    on: vi.fn(),
    invoke: vi.fn(async (channel: string, args: string[]) => {
      switch (channel) {
        case "get-metadata":
          // TODO: turn this into an actual method in mainWindow.ts and then import use it here
          return args[0] && mm.parseBuffer(await fs.promises.readFile(args[0]));
      }
      return;
    }),
    removeAllListeners: vi.fn(),
  }
});

let track: Track;

describe.concurrent("class Track", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(async () => {
    track = await Track.new(mockResource("KOAN Sound & Asa - Starlite.flac"));
  });

  describe.concurrent("Track.new()", () => {
    it("should be able to create an instance of a track", async () => {
      expect(track).toBeTruthy();
    });

    it("should have metadata if the file actually has metadata", async () => {
      expect(track.metadata).toBeTruthy();
    });

    it("should have path property", async () => {
      expect(track.path).toBeTruthy();
    });
  }); 

  describe.concurrent("Track.getFilename()", () => {
    it("should return the filename", async () => {
      expect(track.getFilename()).toBe("KOAN Sound & Asa - Starlite.flac");
    });
  });

  describe.concurrent("Track.getTitleFormatted()", () => {
    it("should return the title if exists", async () => {
      expect(track.getTitleFormatted()).toBe("Starlite");
    });

    it("should return the filename if there's no title in the metadata", async () => {
      const track = await Track.new(mockResource("no-metadata.flac"));
      expect(track.getTitleFormatted()).toBe("no-metadata.flac");
    });
  });

  describe.concurrent("Track.getArtistsFormatted()", () => {
    it("should return the artists if exists", async () => {
      const track = await Track.new(mockResource("KOAN Sound - Traverse.flac"));
      expect(track.getArtistsFormatted()).toBe("KOAN Sound");
    });

    it("should combined multiple artists with &", async () => {
      expect(track.getArtistsFormatted()).toBe("KOAN Sound & Asa");
    });

    it("should default to 'unknown artist' if there is no artists in the metadata", async () => {
      const track = await Track.new(mockResource("no-metadata.flac"));
      expect(track.getArtistsFormatted()).toBe("unknown artist");
    });
  });
  
});
