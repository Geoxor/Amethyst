import { describe, expect, it } from "vitest";

import {parseString, RewFilterType} from "./rewParser.js";

const mockRewFilter = `
Filter Settings file

Room EQ V5.31.3
Dated: May 18, 2025 4:13:30 AM

Notes:

Equaliser: Generic
FL Mar 10
Filter  1: ON  PK       Fc   53.90 Hz  Gain   0.00 dB  Q 10.000
Filter  2: ON  Modal    Fc   89.40 Hz  Gain   0.00 dB  Q 12.197  T60 target   300 ms
Filter  3: ON  LP       Fc   145.5 Hz 
Filter  4: ON  HP       Fc   166.0 Hz 
Filter  5: ON  LP1      Fc   300.0 Hz 
Filter  6: ON  HP1      Fc   370.0 Hz 
Filter  7: ON  LP Q     Fc   100.0 Hz  Q  0.707
Filter  8: ON  HP Q     Fc   100.0 Hz  Q  0.707
Filter  9: ON  LS       Fc    1325 Hz  Gain   0.00 dB
Filter 10: ON  HS       Fc   160.0 Hz  Gain   0.00 dB
Filter 11: ON  LS 6dB   Fc   200.0 Hz  Gain   0.00 dB
Filter 12: ON  HS 6dB   Fc   250.0 Hz  Gain   0.00 dB
Filter 13: ON  LS 12dB  Fc   315.0 Hz  Gain   0.00 dB
Filter 14: ON  HS 12dB  Fc   400.0 Hz  Gain   0.00 dB
Filter 15: ON  LS Q     Fc   500.0 Hz  Gain   0.00 dB Q  0.707
Filter 16: ON  HS Q     Fc   630.0 Hz  Gain   0.00 dB Q  0.707
Filter 17: ON  Notch    Fc   800.0 Hz 
Filter 18: ON  Notch Q  Fc   100.0 Hz  Q  0.707
Filter 19: ON  All pass  Fc   100.0 Hz  Q  0.707
Filter 20: ON  L-T      Fc   50.00 Hz  Q   1.20 Fp 30 Qp 0.50
`;

describe("rewParser", () => {
  it("should parse rew files correctly", () => {
    const rewFilters = parseString(mockRewFilter);
    expect(rewFilters).toHaveLength(20);
    expect(rewFilters[0]).toEqual({
      type: RewFilterType.Peaking,
      frequency: 53.9,
      gain: 0,
      q: 10,
    });
    expect(rewFilters[1]).toEqual({
      type: RewFilterType.Modal,
      frequency: 89.4,
      gain: 0,
      q: 12.197,
    });
    expect(rewFilters[2]).toEqual({
      type: RewFilterType.LowPass,
      frequency: 145.5,
    });
    expect(rewFilters[3]).toEqual({
      type: RewFilterType.HighPass,
      frequency: 166,
    });
    expect(rewFilters[4]).toEqual({
      type: RewFilterType.LowPass1,
      frequency: 300,
    });
    expect(rewFilters[5]).toEqual({
      type: RewFilterType.HighPass1,
      frequency: 370,
    });

    expect(rewFilters[6]).toEqual({
      type: RewFilterType.LowPassQ,
      frequency: 100,
      q: 0.707,
    });
    expect(rewFilters[7]).toEqual({
      type: RewFilterType.HighPassQ,
      frequency: 100,
      q: 0.707,
    });
    expect(rewFilters[8]).toEqual({
      type: RewFilterType.LowShelf,
      frequency: 1325,
      gain: 0,
    });
    expect(rewFilters[9]).toEqual({
      type: RewFilterType.HighShelf,
      frequency: 160,
      gain: 0,
    });
    expect(rewFilters[10]).toEqual({
      type: RewFilterType.LowShelf6,
      frequency: 200,
      gain: 0,
    });
    expect(rewFilters[11]).toEqual({
      type: RewFilterType.HighShelf6,
      frequency: 250,
      gain: 0,
    });
    expect(rewFilters[12]).toEqual({
      type: RewFilterType.LowShelf12,
      frequency: 315,
      gain: 0,
    });
    expect(rewFilters[13]).toEqual({
      type: RewFilterType.HighShelf12,
      frequency: 400,
      gain: 0,
    });
    expect(rewFilters[14]).toEqual({
      type: RewFilterType.LowShelfQ,
      frequency: 500,
      gain: 0,
      q: 0.707,
    });
    expect(rewFilters[15]).toEqual({
      type: RewFilterType.HighShelfQ,
      frequency: 630,
      gain: 0,
      q: 0.707,
    });
    expect(rewFilters[16]).toEqual({
      type: RewFilterType.Notch,
      frequency: 800,
    });
    expect(rewFilters[17]).toEqual({
      type: RewFilterType.NotchQ,
      frequency: 100,
      q: 0.707,
    });
    expect(rewFilters[18]).toEqual({
      type: RewFilterType.Allpass,
      frequency: 100,
      q: 0.707,
    });
    expect(rewFilters[19]).toEqual({
      type: RewFilterType.LinkwitzTransform,
      frequency: 50,
      q: 1.2,
      fp: 30,
      qp: 0.5,
    });
  });
});
