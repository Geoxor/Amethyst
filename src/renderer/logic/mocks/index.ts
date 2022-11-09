import { vi } from "vitest";
import { Metadata } from "../../../main/metadata";

export const electron = {
  ipcRenderer: {
    on: vi.fn(),
    invoke: vi.fn(async (channel: string, args: string[]) => {
      switch (channel) {
        case "get-metadata":
          return Metadata.getMetadata(args[0]);
        case "get-cover":
          return Buffer.from([0, 0, 0]);
      }
      return;
    }),
  }
};

export const Audio = vi.fn(() => ({
  pause: vi.fn(),
  play: vi.fn(),
  addEventListener: vi.fn()
}));

export const mockResource = (path: string) => `./src/renderer/mocks/${path}`;
