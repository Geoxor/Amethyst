use serde::{Deserialize, Serialize};

mod default;

#[derive(Clone, Debug, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(default)]
pub struct Settings {
    pub appearance: Appearance,
    pub performance: Performance,
    pub behavior: Behavior,
    pub metering: Metering,
    pub audio: Audio,
    pub integrations: Integrations,
    pub keybinds: Keybinds,
    pub application: Application,
    pub columns: Columns,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(default)]
pub struct Appearance {
    animation_duration: usize,
    font_weight: String,
    theme: String,
    desktop_mode: bool,
    custom_colors: CustomColors,
    cover_based_colors: bool,
    cover_based_icon_colors: bool,
    ambient_background: Background,
    shader: Shader,
    neon_mode: bool,
    show_playback_controls: bool,
    minimalist_mode: bool,
    hide_category_titles: bool,
    show_cover_art: bool,
    compact_list: bool,
    show_debug_stats: bool,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(default)]
pub struct CustomColors {
    pub enabled: bool,
    pub colors: CustomColorData,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(default)]
pub struct CustomColorData {
    pub accent: String,
    pub primary: String,
    pub inspector: String,
    pub alert: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(default)]
pub struct Background {
    show: bool,
    opacity: usize,
    spin: bool,
    blur_strength: usize,
    spin_speed: usize,
    zoom: usize,
    blend_mode: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(default)]
pub struct Shader {
    #[serde(rename = "use")]
    enabled: bool,
    selected: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(default)]
pub struct Performance {
    use_vsync: bool,
    processing_concurrency: usize,
    pause_visuals_when_unfocused: bool,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(default)]
pub struct Behavior {
    auto_play_on_startup: bool,
    fetch_metadata_on_startup: bool,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(default)]
pub struct Metering {
    loudness_meter: LoudnessMeter,
    oscilloscope: Oscilloscope,
    vectorscope: Vectorscope,
    spectrum: Spectrum,
    spectrum_line: SpectrumLine,
    spectrum_bars: SpectrumBars,
    spectrogram: Spectrogram,
    decibel_meter: DecibelMeter,
    shader: Shader,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(default)]
pub struct LoudnessMeter {
    show: bool,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(default)]
pub struct Oscilloscope {
    show: bool,
    smoothing: f32,
    fft_size: usize,
    line_thickness: usize,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(default)]
pub struct Vectorscope {
    show: bool,
    smoothing: f32,
    lissajous: bool,
    fft_size: usize,
    line_thickness: f32,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(default)]
pub struct Spectrum {
    show: bool,
    #[serde(rename = "type")]
    ty: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(default)]
pub struct SpectrumLine {
    smoothing: f32,
    fft_size: usize,
    line_thickness: f32,
    fill_opacity: f32,
    opacity_falloff: f32,
    max_decibels: f32,
    min_decibels: f32,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(default)]
pub struct SpectrumBars {
    smoothing: f32,
    fft_size: usize,
    bars: usize,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(default)]
pub struct Spectrogram {
    smoothing: f32,
    fft_size: usize,
    logarithmic: bool,
    scroll_speed: f32,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(default)]
pub struct DecibelMeter {
    minimum_db: f32,
    separate_pre_post: bool,
    show: bool,
    fft_size: usize,
    smoothing_duration: usize,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(default)]
pub struct Audio {
    driver: String,
    buffer_size: usize,
    resample_rate: usize,
    output_device_name: String,
    output_realtime_device_name: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(default)]
pub struct Integrations {
    discord: Discord,
    last_fm: LastFm,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(default)]
pub struct Discord {
    pub enabled: bool,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(default)]
pub struct LastFm {
    enabled: bool,
    enable_scrobbling: bool,
    username: String,
    password: String,
    session_key: String,
}

#[derive(Clone, Debug, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(default)]
pub struct Keybinds {}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(default)]
pub struct Application {
    auto_start: bool,
    auto_updates_enabled: bool,
    language: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(default)]
pub struct Columns {
    cover: bool,
    artist: bool,
    disk_number: bool,
    title: bool,
    filename: bool,
    album: bool,
    year: bool,
    play_count: bool,
    skip_count: bool,
    date_added: bool,
    bits_per_sample: bool,
    genre: bool,
    bitrate: bool,
    sample_rate: bool,
    barcode: bool,
    label: bool,
    isrc: bool,
    copyright: bool,
    bpm: bool,
    duration: bool,
    track_number: bool,
    location: bool,
    container: bool,
    favorite: bool,
    size: bool,
}
