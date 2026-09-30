use std::fs::File;
use std::io::{ErrorKind as IoErrorKind, Result as IoResult};
use std::path::Path;

use tauri::Manager;

use crate::settings::Settings;

mod settings;
mod source;

const SETTINGS_FILE: &'static str = "settings.json";

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(init)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn init(app: &mut tauri::App) -> std::result::Result<(), Box<dyn std::error::Error>> {
    if cfg!(debug_assertions) {
        app.handle().plugin(
            tauri_plugin_log::Builder::default()
                .level(log::LevelFilter::Info)
                .build(),
        )?;
    }

    let config_path = app.path().app_config_dir()?;
    std::fs::create_dir_all(&config_path)?;
    let settings = load_config(&config_path.join(SETTINGS_FILE))?;
    app.manage(settings);
    Ok(())
}

fn load_config<P: AsRef<Path>>(path: &P) -> IoResult<Settings> {
    let file = match File::open(path) {
        Ok(file) => file,
        Err(err) if err.kind().eq(&IoErrorKind::NotFound) => {
            let new_file = File::create(path)?;
            let default_settings = Settings::default();
            serde_json::to_writer_pretty(new_file, &default_settings)?;
            return Ok(default_settings);
        }
        Err(err) => return Err(err),
    };
    Ok(serde_json::from_reader(file)?)
}
