import { describe, expect, it, vi, afterEach, beforeAll } from "vitest";
import { AudioContext } from "standardized-audio-context-mock";

import { Track } from "../logic/track";
import { Metadata } from "../../main/metadata";

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
          return Metadata.getMetadata(args[0]);
        case "get-cover":
          return Metadata.getResizedCover(args[0]);
      }
      return;
    }),
  }
});

let track: Track;

describe.concurrent("class Track", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe.concurrent("track.fetchAsyncData()", () => {
    const track = new Track(mockResource("House - Zenith v1.mp3"));

    it("should be able to fetch metadata", async () => {
      await track.fetchMetadata();
      expect(track.metadata.data).toBeTruthy();
    });

    it("should be able to fetch cover", async () => {
      await track.fetchCover();
      expect(track.cover.data).toBeTruthy();
    });

    it("should be able to fetch both metadata and cover", async () => {
      const track = new Track(mockResource("House - Zenith v1.mp3"));
      await track.fetchAsyncData();
      expect(track.metadata.data).toBeTruthy();
      expect(track.cover.data).toBeTruthy();
    });
  });

  beforeAll(async () => {
    track = new Track(mockResource("KOAN Sound & Asa - Starlite.flac"));
    await track.fetchAsyncData();
  });

  describe.concurrent("new Track()", () => {
    it("should be able to create an instance of a track", async () => {
      expect(track).toBeTruthy();
    });

    it("should have metadata if the file actually has metadata", async () => {
      expect(track.metadata.data).toBeTruthy();
    });

    it("should have path property", async () => {
      expect(track.path).toBeTruthy();
    });
  });

  describe.concurrent("track.getFilename()", () => {
    it("should return the filename", async () => {
      expect(track.getFilename()).toBe("KOAN Sound & Asa - Starlite.flac");
    });
  });

  describe.concurrent("track.getTitleFormatted()", () => {
    it("should return the title if exists", async () => {
      expect(track.getTitleFormatted()).toBe("Starlite");
    });

    it("should return the filename if there's no title in the metadata", async () => {
      const track = new Track(mockResource("no-metadata.flac"));
      await track.fetchAsyncData();
      expect(track.getTitleFormatted()).toBe("no-metadata.flac");
    });
  });

  describe.concurrent("track.getArtistsFormatted()", () => {
    it("should return the artists if exists", async () => {
      const track = new Track(mockResource("KOAN Sound - Traverse.flac"));
      await track.fetchAsyncData();
      expect(track.getArtistsFormatted()).toBe("KOAN Sound");
    });

    it("should combined multiple artists with &", async () => {
      expect(track.getArtistsFormatted()).toBe("KOAN Sound & Asa");
    });

    it("should default to 'unknown artist' if there is no artists in the metadata", async () => {
      const track = new Track(mockResource("no-metadata.flac"));
      await track.fetchAsyncData();
      expect(track.getArtistsFormatted()).toBe("unknown artist");
    });
  });

  describe.concurrent("track.getDurationSeconds()", () => {
    it("should return the duration in seconds", async () => {
      const track = new Track(mockResource("House - Zenith v1.mp3"));
      await track.fetchAsyncData();
      expect(~~track.getDurationSeconds()).toBe(15);
    });

    it("should return 0 if it has no metadata", async () => {
      const track = new Track(mockResource("no-metadata.flac"));
      await track.fetchAsyncData();
      // @ts-ignore
      track.metadata.data!.format.duration = undefined;
      expect(~~track.getDurationSeconds()).toBe(0);
    });
  });

  describe.concurrent("track.getDurationFormatted()", () => {
    it("should return the duration in a formatted string", async () => {
      const track = new Track(mockResource("House - Zenith v1.mp3"));
      await track.fetchAsyncData();
      expect(track.getDurationFormatted()).toBe("0:15");
    });
  });

  describe.concurrent("track.getCover()", () => {
    it("should return undefined when there's no picture", async () => {
      const track = new Track(mockResource("no-metadata.flac"));
      await track.fetchAsyncData();
      expect(track.getCover()).toBeFalsy();
    });

    it("should return an IPicture object when there is one", async () => {
      const track = new Track(mockResource("House - Zenith v1.mp3"));
      await track.fetchAsyncData();
      expect(track.getCover()).toBeTruthy();
    });
  });
});
