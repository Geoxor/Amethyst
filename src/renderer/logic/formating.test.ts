import { describe, expect, it } from "vitest";
import { bytesToHuman, secondsToHuman } from "./formating";

describe.concurrent("secondsToHuman()", () => {
  it("should convert 60s to '1:00'", () => {
    expect(secondsToHuman(60)).toBe("1:00");
  });
  it("should convert 0s to '0:00'", () => {
    expect(secondsToHuman(0)).toBe("0:00");
  });
  it("should convert 600s to '10:00'", () => {
    expect(secondsToHuman(600)).toBe("10:00");
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
