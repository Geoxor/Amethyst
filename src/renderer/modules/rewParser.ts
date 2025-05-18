export enum RewFilterType {
  Peaking = "PK",
  Modal = "Modal",
  HighShelf = "HS",
  HighShelf6 = "HS 6dB",
  HighShelf12 = "HS 12dB",
  HighShelfQ = "HS Q",
  HighPassQ = "HP Q",
  HighPass = "HP",
  HighPass1 = "HP1",
  LowPassQ = "LP Q",
  LowPass1 = "LP1",
  LowPass = "LP",
  LowShelf = "LS",
  LowShelf6 = "LS 6dB",
  LowShelf12 = "LS 12dB",
  LowShelfQ = "LS Q",
  Notch = "Notch",
  NotchQ = "Notch Q",
  Allpass = "All pass",
  LinkwitzTransform = "L-T",
}

export type PeakingFilter = {
  type: RewFilterType.Peaking;
  frequency: number;
  gain: number;
  q: number;
};

export type ModalFilter = {
  type: RewFilterType.Modal;
  frequency: number;
  gain: number;
  q: number;
  // t60 ignored
};

export type LowPassFilter = {
  type: RewFilterType.LowPass | RewFilterType.LowPass1;
  frequency: number;
};

export type HighPassFilter = {
  type: RewFilterType.HighPass | RewFilterType.HighPass1;
  frequency: number;
};

export type LowPassQFilter = {
  type: RewFilterType.LowPassQ;
  frequency: number;
  q: number;
};

export type HighPassQFilter = {
  type: RewFilterType.HighPassQ;
  frequency: number;
  q: number;
};

export type HighShelfFilter = {
  type: RewFilterType.HighShelf | RewFilterType.HighShelf6 | RewFilterType.HighShelf12;
  frequency: number;
  gain: number;
};

export type LowShelfFilter = {
  type: RewFilterType.LowShelf | RewFilterType.LowShelf6 | RewFilterType.LowShelf12;
  frequency: number;
  gain: number;
};

export type HighShelfQFilter = {
  type: RewFilterType.HighShelfQ;
  frequency: number;
  gain: number;
  q: number;
};

export type LowShelfQFilter = {
  type: RewFilterType.LowShelfQ;
  frequency: number;
  gain: number;
  q: number;
};

export type NotchFilter = {
  type: RewFilterType.Notch;
  frequency: number;
};

export type NotchQFilter = {
  type: RewFilterType.NotchQ;
  frequency: number;
  q: number;
};

export type AllpassFilter = {
  type: RewFilterType.Allpass;
  frequency: number;
  q: number;
};

export type LinkwitzTransformFilter = {
  type: RewFilterType.LinkwitzTransform;
  frequency: number;
  q: number;
  fp: number;
  qp: number;
};

export type RewFilter =
  | PeakingFilter
  | ModalFilter
  | LowPassFilter
  | HighPassFilter
  | LowPassQFilter
  | HighPassQFilter
  | HighShelfFilter
  | LowShelfFilter
  | HighShelfQFilter
  | LowShelfQFilter
  | NotchFilter
  | NotchQFilter
  | AllpassFilter
  | LinkwitzTransformFilter;

export type RewFilters = RewFilter[];

const filterRegex = /Filter\s+(?<index>\d+):\s+ON\s+(?<type>[\w\s-]+?)\s+Fc\s+(?<fc>[\d.]+)\s+Hz(?:\s+Gain\s+(?<gain>[-\d.]+)\s+dB)?(?:\s+Q\s+(?<q>[\d.]+))?(?:\s+T60 target\s+(?<t60>\d+)\s+ms)?(?:\s+Fp\s+(?<fp>[\d.]+))?(?:\s+Qp\s+(?<qp>[\d.]+))?/;

/**
 * Should be used to parse a REW 'as text' txt file.
 */
export const parseString = (data: string): RewFilters => {
  const lines = data.split("\n");
  const filters: RewFilters = [];

  for (const line of lines) {
    const match = line.match(filterRegex);
    if (match) {
      const type = match[2] as RewFilterType;
      const frequency = parseFloat(match[3]);
      const gain = match[4] ? parseFloat(match[4]) : undefined;
      const q = match[5] ? parseFloat(match[5]) : undefined;
      // const t60 = match[6] ? parseFloat(match[6]) : undefined;
      const fp = match[7] ? parseFloat(match[7]) : undefined;
      const qp = match[8] ? parseFloat(match[8]) : undefined;

      let filter: RewFilter;

      switch (type) {
        case RewFilterType.Peaking:
          filter = { type, frequency, gain: gain!, q: q! };
          break;
        case RewFilterType.Modal:
          filter = { type, frequency, gain: gain!, q: q! };
          break;
        case RewFilterType.LowPass:
        case RewFilterType.LowPass1:
          filter = { type, frequency };
          break;
        case RewFilterType.HighPass:
        case RewFilterType.HighPass1:
          filter = { type, frequency };
          break;
        case RewFilterType.LowPassQ:
          filter = { type, frequency, q: q! };
          break;
        case RewFilterType.HighPassQ:
          filter = { type, frequency, q: q! };
          break;
        case RewFilterType.HighShelf:
        case RewFilterType.HighShelf6:
        case RewFilterType.HighShelf12:
          filter = { type, frequency, gain: gain! };
          break;
        case RewFilterType.LowShelf:
        case RewFilterType.LowShelf6:
        case RewFilterType.LowShelf12:
          filter = { type, frequency, gain: gain! };
          break;
        case RewFilterType.HighShelfQ:
        case RewFilterType.LowShelfQ:
          filter = { type, frequency, gain: gain!, q: q! };
          break;  
        case RewFilterType.Notch:
          filter = { type, frequency }; 
          break;
        case RewFilterType.NotchQ:
          filter = { type, frequency, q: q! };  
          break;
        case RewFilterType.Allpass: 
          filter = { type, frequency, q: q! };  
          break;  
        case RewFilterType.LinkwitzTransform:
          filter = { type, frequency, q: q!, fp: fp!, qp: qp! };  
          break;
        default:
          throw new Error(`Unknown filter type: ${type}`);
      }

      filters.push(filter);

      }
  }

  return filters;
}
