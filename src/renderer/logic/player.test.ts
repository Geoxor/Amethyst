import { AudioContext } from "standardized-audio-context-mock";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { Audio, electron } from "./mocks";

vi.stubGlobal("AudioContext", AudioContext);
vi.stubGlobal("Audio", Audio);
vi.stubGlobal("electron", electron);
vi.mock("@/amethyst", () => ({
  useState: vi.fn(() => ({
    settings: vi.fn(),
  }))
}));

import { LoopMode, Player } from "./player";

describe.concurrent("class Player", () => {
  let player: Player;

  afterEach(() => {
    vi.restoreAllMocks(); 
  });

  beforeAll(() => {
    player = new Player();
  });

  describe("new Player()", () => {
    it("should be able to create an instance of a Player", () => {
      expect(player).toBeTruthy();
    });

    it("should have a isPlaying state", () => {
      expect(player.isPlaying).toBeTruthy();
    });

    it("should have isPlaying set to false when initialized", () => {
      expect(player.isPlaying.value).toBe(false);
    });

    it("should have a isStopped state", () => {
      expect(player.isStopped).toBeTruthy();
    });

    it("should have isStopped set to true when initialized", () => {
      expect(player.isStopped.value).toBe(true);
    });

    it("should have a isPaused state", () => {
      expect(player.isPaused).toBeTruthy();
    });

    it("should have isPaused set to false when initialized", () => {
      expect(player.isPaused.value).toBe(false);
    });

    it("should have a volume state", () => {
      expect(player.volume).toBeTruthy();
    });

    it("should have a loopMode state", () => {
      expect(player.loopMode).toBeTruthy();
    });

    it("should have a queue", () => {
      expect(player.queue).toBeTruthy();
    });
  });

  describe("player.play()", () => {
    beforeAll(() => player.play());

    it("should set the isPlaying state to true", () => {
      expect(player.isPlaying.value).toBe(true);
    });
    it("should set the isStopped state to false", () => {
      expect(player.isStopped.value).toBe(false);
    });
    it("should set the isPaused state to false", () => {
      expect(player.isPaused.value).toBe(false);
    }); 
  });

  describe("player.pause()", () => {
    beforeAll(() => player.pause());

    it("should set the isPlaying state to false", () => {
      expect(player.isPlaying.value).toBe(false);
    });
    it("should set the isStopped state to false", () => {
      expect(player.isStopped.value).toBe(false);
    });
    it("should set the isPaused state to true", () => {
      expect(player.isPaused.value).toBe(true);
    });
  });

  describe("player.stop()", () => {
    beforeAll(() => player.stop());

    it("should set the isPlaying state to false", () => {
      expect(player.isPlaying.value).toBe(false);
    });
    it("should set the isStopped state to true", () => {
      expect(player.isStopped.value).toBe(true);
    });
    it("should set the isPaused state to false", () => {
      expect(player.isPaused.value).toBe(false);
    });
  });

  describe("player.loopNone()", () => {
    const player = new Player();
    player.loopNone();
    it("should set the loopMode to LoopMode.None", () => {
      expect(player.loopMode.value == LoopMode.None).toBeTruthy();
    });
  });
  
  describe("player.loopOne()", () => {
    const player = new Player();
    player.loopOne();
    it("should set the loopMode to LoopMode.One", () => {
      expect(player.loopMode.value == LoopMode.One).toBeTruthy();
    });
  });
  
  describe("player.loopAll()", () => {
    const player = new Player();
    player.loopAll();
    it("should set the loopMode to LoopMode.All", () => {
      expect(player.loopMode.value == LoopMode.All).toBeTruthy();
    });
  });

  describe("player.setVolume()", () => {
    it("should set the volume", () => {
      player.setVolume(0.50);
      expect(player.volume.value).toBe(0.50);
    });

    it("should set to 0 if given <0", () => {
      player.setVolume(-0.50);
      expect(player.volume.value).toBe(0);
    });

    it("should set to 1 if given >1", () => {
      player.setVolume(2.50);
      expect(player.volume.value).toBe(1);
    });
  });

  describe("player.volumeUp()", () => {
    beforeEach(() => player.setVolume(0.50));

    it("should raise the volume by 0.1 as default", () => {
      player.volumeUp();
      expect(player.volume.value).toBe(0.60);
    });

    it("should raise the volume by 0.2 if given 0.2", () => {
      player.volumeUp(0.2);
      expect(player.volume.value).toBe(0.70);
    });

    it("should lower the volume by 0.1 as default", () => {
      player.volumeDown();
      expect(player.volume.value).toBe(0.40);
    });

    it("should lower the volume by 0.2 if given 0.2", () => {
      player.volumeDown(0.2);
      expect(player.volume.value).toBe(0.30);
    });
  });
});