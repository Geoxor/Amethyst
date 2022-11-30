import { ElectronEventManager } from "@/electronEventManager";
import { Store } from "@/state";
import { describe, expect, it, vi } from "vitest";
import { CPUUsageMonitor } from "./CPUUsageMonitor";
import { electron } from "./mocks";

vi.stubGlobal("electron", electron);

describe("CPUUsageMonitor", () => {
  const state = new Store();
  const electron = new ElectronEventManager(state);

  it("should instantiate successfully", () => {
    const monitor = new CPUUsageMonitor(state, electron);
    expect(monitor).toBeTruthy();
  });
});