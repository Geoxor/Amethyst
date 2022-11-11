import { describe, expect, it } from "vitest";
import { bytesToHuman, secondsToHuman } from "./formating";

describe.concurrent("secondsToHuman()", () => {
  it("should convert 0s to '0s'", () => {
    expect(secondsToHuman(0)).toBe("0ms");
  });

  it("should convert 60s to '1m'", () => {
    expect(secondsToHuman(60)).toBe("1m");
  });
  
  it("should convert 600s to '10m'", () => {
    expect(secondsToHuman(600)).toBe("10m");
  });

  it("should convert 3600s to '1h'", () => {
    expect(secondsToHuman(3600)).toBe("1h");
  });

  it("should convert 86400s to '1d'", () => {
    expect(secondsToHuman(86400)).toBe("1d");
  });
});

describe.concurrent("bytesToHuman()", () => {
  it("should convert 0 to '0 B'", () => {
    expect(bytesToHuman(0)).toBe("0 B");
  });

  it("should convert 1024 to '1 KB'", () => {
    expect(bytesToHuman(1024)).toBe("1 KB");
  });

  it("should convert 1048576 to '1 MB'", () => {
    expect(bytesToHuman(1048576)).toBe("1 MB");
  });

  it("should convert 4294967296 to '4 GB'", () => {
    expect(bytesToHuman(4294967296)).toBe("4 GB");
  });
});
