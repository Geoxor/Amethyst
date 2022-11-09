import { AudioContext } from "standardized-audio-context-mock";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { Audio, electron, mockResource } from "./mocks";
import { Queue } from "./queue";

vi.stubGlobal("AudioContext", AudioContext);
vi.stubGlobal("Audio", Audio);
vi.stubGlobal("electron", electron);

describe.concurrent("class Queue", () => {
  let queue: Queue;

  afterEach(() => {
    vi.restoreAllMocks(); 
  });

  beforeAll(() => {
    queue = new Queue([
      mockResource("House - Zenith v1.mp3"),
      mockResource("KOAN Sound & Asa - Starlite.flac"),
      mockResource("no-metadata.flac"),
    ]);
  });

  describe("new Queue()", () => {
    it("should be able to create an instance of a Queue", () => {
      expect(queue).toBeTruthy();
    });

    it("should have a size of 4", () => {
      expect(queue.getList().size).toEqual(3);
    });
  });

  describe("queue.add()", () => {
    it("should add a track to the queue", () => {
      queue.add(mockResource("KOAN Sound - Traverse.flac")),
      expect(queue.getList().size).toEqual(4);
    });

    it("shouldn't add dupes", () => {
      queue.add(mockResource("KOAN Sound - Traverse.flac")),
      queue.add(mockResource("KOAN Sound - Traverse.flac")),
      queue.add(mockResource("KOAN Sound - Traverse.flac")),
      queue.add(mockResource("KOAN Sound - Traverse.flac")),
      expect(queue.getList().size).toEqual(4);
    });
  });

  describe("queue.remove()", () => {
    it("can remove a track from the queue", () => {
      queue.remove(3),
      expect(queue.getList().size).toEqual(3);
    });
  });
});