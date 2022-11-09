import { AudioContext } from "standardized-audio-context-mock";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { Audio, electron } from "./mocks";
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
    queue = new Queue();
  });

  describe("new Queue()", () => {
    it("should be able to create an instance of a Queue", () => {
      expect(queue).toBeTruthy();
    });
  });
});