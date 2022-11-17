import { AudioContext } from "standardized-audio-context-mock";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Audio, electron, mockResource } from "./mocks";

vi.stubGlobal("AudioContext", AudioContext);
vi.stubGlobal("Audio", Audio);
vi.stubGlobal("electron", electron);

import { Queue } from "./queue";

describe.concurrent("class Queue", () => {
  afterEach(() => {
    vi.restoreAllMocks(); 
  }); 

  describe("new Queue()", () => {
    it("should be able to create an instance of a Queue", () => {
      const queue = new Queue();
      expect(queue).toBeTruthy();
    });

    it("should have a size of 3", () => {
      const queue = new Queue();
      queue.add(mockResource("House - Zenith v1.mp3"));
      queue.add(mockResource("KOAN Sound & Asa - Starlite.flac"));
      queue.add(mockResource("no-metadata.flac"));
      expect(queue.getList().length).toEqual(3);
    });
  });

  describe("queue.add()", () => {
    it("should add a track to the queue", () => {
      const queue = new Queue();
      queue.add(mockResource("KOAN Sound - Traverse.flac")),
      expect(queue.getList().length).toEqual(1);
    });

    it("shouldn't add dupes", () => {
      const queue = new Queue();
      queue.add(mockResource("KOAN Sound - Traverse.flac")),
      queue.add(mockResource("KOAN Sound - Traverse.flac")),
      queue.add(mockResource("KOAN Sound - Traverse.flac")),
      queue.add(mockResource("KOAN Sound - Traverse.flac")),
      expect(queue.getList().length).toEqual(1);
    });
  });

  describe("queue.remove()", () => {
    it("can remove a track from the queue", () => {
      const queue = new Queue([
        mockResource("House - Zenith v1.mp3"),
        mockResource("KOAN Sound & Asa - Starlite.flac"),
        mockResource("no-metadata.flac"),
      ]);

      queue.remove(2),
      expect(queue.getList().length).toEqual(2);
    });
  });
});