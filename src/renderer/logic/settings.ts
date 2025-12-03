import { AmethystPlatforms } from "@/amethyst.js";
import type { MediaSourceType } from "@/logic/mediaSources.js";

export const VALID_SAMPLE_RATES = [
  4000,
  8000,
  11025,
  16000,
  22050,
  44100,
  48000,
  88200,
  96000,
  176400,
  192000,
  352800,
  384000,
];

export const VALID_BUFFER_SIZES = [256, 512, 1024];

export const AVAILABLE_THEMES = [
  "amethyst-dark",
  "emerald-dark",
  "onyx-dark",
  "sapphire-dark",
  "rose-dark", // is missing css variables
  "ruby-dark", // is missing css variables
];

export const SPECTRUM_TYPES = [
  "line",
  "bars",
  "spectrogram",
];

export type SPECTRUM_TYPES_STRING = "line" | "bars" | "spectrogram";

const DEFAULT_APPEARANCE_SETTINGS = {
  appearance: {
    animationDuration: 100,
    fontWeight: "normal",
    theme: "amethyst-dark",
    desktopMode: false,
    customColors: {
      enabled: false,
      colors: {
        accent: "#A58CDB",
        primary: "#A58CDB",
        inspector: "#94afff",
        alert: "#1fa9ff",
      },
    },
    coverBasedColors: false,
    coverBasedIconColors: false,
    ambientBackground: {
      show: false,
      opacity: 10,
      spin: true,
      blurStrength: 96,
      spinSpeed: 64,
      zoom: 130,
      blendMode: "normal",
    },
    shader: {
      use: false,
      selected: "none",
    },
    neonMode: false,
    showPlaybackControls: true,
    minimalistMode: false,
    hideCategoryTitles: true,
    showCoverArt: true,
    compactList: true,
    showDebugStats: false,
  },
};

const DEFAULT_PERFORMANCE_SETTINGS = {
  performance: {
    useVsync: true,
    processingConcurrency: 3,
    pauseVisualsWhenUnfocused: false,
  },
};

const DEFAULT_BEHAVIOR_SETTINGS = {
  behavior: {
    autoPlayOnStartup: false,
    fetchMetadataOnStartup: true,
  },
};

const DEFAULT_METERING_SETTINGS = {
  metering: {
    loudnessMeter: {
      show: true,
    },
    oscilloscope: {
      show: true,
      smoothing: 0.5,
      fftSize: 8192,
      lineThickness: 1,
    },
    vectorscope: {
      show: true,
      smoothing: 0.5,
      lissajous: true,
      fftSize: 512,
      lineThickness: 1,
    },
    spectrum: {
      show: true,
      type: "line" as SPECTRUM_TYPES_STRING,
    },
    spectrumLine: {
      smoothing: 0.5,
      fftSize: 8192,
      lineThickness: 1,
      fillOpacity: 0.15,
      opacityFalloff: 1,
      maxDecibels: 0,
      minDecibels: -128,
    },
    spectrumBars: {
      smoothing: 0.5,
      fftSize: 1024,
      bars: 64,
    },
    spectrogram: {
      smoothing: 0.0,
      fftSize: 4096,
      logarithmic: true,
      scrollSpeed: 1.0,
    },
    decibelMeter: {
      minimumDb: -60,
      separatePrePost: false,
      show: true,
      fftSize: 2048,
      smoothingDuration: 60,
    },
    shader: {
      use: false,
      selected: "none",
    },
  },
};

const DEFAULT_AUDIO_SETTINGS = {
  audio: {
    driver: "default" as "default" | "asio" | "coreaudio" | "alsa",
    bufferSize: 256,
    resampleRate: 44100,
    outputDeviceName: "default",
    outputRealtimeDeviceName: "",
  },
};

const DEFAULT_INTEGRATION_SETTINGS = {
  integrations: {
    discord: {
      enabled: true,
    },
    lastFm: {
      enabled: false,
      enableScrobbling: true,
      username: "",
      password: "",
      sessionKey: "",
    },
  },
};

const DEFAULT_MEDIA_SOURCE_SETTINGS = {
  mediaSources: {
    saveMediaSources: [{}] as { type: MediaSourceType; path: string; uuid: string }[],
  },
};

const DEFAULT_KEYBIND_SETTINGS = {
  keybinds: {},
};

const DEFAULT_APPLICATION_SETTINGS = {
  application: {
    autoStart: false,
    autoUpdatesEnabled: true,
    language: "en-US",
  },
};

const DEFAULT_COLUMN_SETTINGS = {
  columns: {
    cover: true,
    artist: true,
    diskNumber: false,
    title: true,
    filename: false,
    album: true,
    year: true,
    playCount: false,
    skipCount: false,
    dateAdded: true,
    bitsPerSample: true,
    genre: false,
    bitrate: true,
    sampleRate: true,
    barcode: false,
    label: false,
    isrc: false,
    copyright: false,
    bpm: false,
    duration: true,
    trackNumber: true,
    location: true,
    container: true,
    favorite: true,
    size: true,
  },
};

const DEFAULT_SETTINGS = {
  ...DEFAULT_APPEARANCE_SETTINGS,
  ...DEFAULT_PERFORMANCE_SETTINGS,
  ...DEFAULT_BEHAVIOR_SETTINGS,
  ...DEFAULT_METERING_SETTINGS,
  ...DEFAULT_AUDIO_SETTINGS,
  ...DEFAULT_INTEGRATION_SETTINGS,
  ...DEFAULT_MEDIA_SOURCE_SETTINGS,
  ...DEFAULT_KEYBIND_SETTINGS,
  ...DEFAULT_APPLICATION_SETTINGS,
  ...DEFAULT_COLUMN_SETTINGS,
};

export const createDefaultSettings = (platform: AmethystPlatforms): typeof DEFAULT_SETTINGS => {
  const defaultSettings = DEFAULT_SETTINGS;
  if (platform == "mobile") {
    defaultSettings.appearance.minimalistMode = true;
    defaultSettings.metering.decibelMeter.show = false;
    defaultSettings.metering.oscilloscope.show = false;
    defaultSettings.metering.vectorscope.show = false;
    defaultSettings.metering.loudnessMeter.show = false;
    defaultSettings.metering.spectrum.show = false;
    defaultSettings.performance.pauseVisualsWhenUnfocused = true;
    defaultSettings.columns = {
      cover: true,
      artist: true,
      title: true,
      diskNumber: false,
      filename: false,
      album: false,
      year: false,
      bitsPerSample: false,
      genre: false,
      bitrate: false,
      sampleRate: false,
      playCount: false,
      skipCount: false,
      dateAdded: false,
      barcode: false,
      label: false,
      isrc: false,
      copyright: false,
      bpm: false,
      duration: false,
      trackNumber: false,
      location: false,
      container: false,
      favorite: false,
      size: false,
    };
  }
  return defaultSettings;
};
