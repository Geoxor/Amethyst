use std::collections::HashSet;
use std::fs::{self, File};
use std::io::{Error as IoError, ErrorKind as IoErrorKind, Result as IoResult};
use std::path::Path;
use std::sync::Mutex;

use diesel::{Connection, SqliteConnection};
use diesel_migrations::{EmbeddedMigrations, MigrationHarness, embed_migrations};
use tauri::Manager;

use crate::settings::Settings;
use crate::source::MediaSource;

mod db;
mod settings;
mod source;

const DATABASE_MIGRATIONS: EmbeddedMigrations = embed_migrations!("migrations");

const DATABASE_FILE: &'static str = "database.sqlite3";
const SETTINGS_FILE: &'static str = "settings.json";
const SOURCE_DIRECTORY: &'static str = "sources";

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
    fs::create_dir_all(&config_path)?;

    app.manage(load_config(&config_path)?);
    app.manage(load_sources(&config_path)?);
    app.manage(Mutex::new(setup_database(&config_path)?));
    Ok(())
}

fn load_config<P: AsRef<Path>>(config_dir: &P) -> IoResult<Settings> {
    let path = config_dir.as_ref().join(SETTINGS_FILE);
    let file = match File::open(&path) {
        Ok(file) => file,
        Err(err) if err.kind().eq(&IoErrorKind::NotFound) => {
            let new_file = File::create(&path)?;
            let default_settings = Settings::default();
            serde_json::to_writer_pretty(new_file, &default_settings)?;
            return Ok(default_settings);
        }
        Err(err) => return Err(err),
    };
    Ok(serde_json::from_reader(file)?)
}

fn load_sources<P: AsRef<Path>>(config_dir: &P) -> IoResult<HashSet<MediaSource>> {
    let sources_dir = config_dir.as_ref().join(SOURCE_DIRECTORY);
    fs::create_dir_all(&sources_dir)?;

    let mut sources = HashSet::<MediaSource>::with_capacity(10);

    for entry in fs::read_dir(&sources_dir)? {
        let entry = entry?;
        let path = entry.path();
        let ty = entry.file_type()?;

        // TODO: Handle symlinks?

        if ty.is_file() {
            let mut file = File::open(&path)?;
            let source: MediaSource = serde_json::from_reader(&mut file)?;
            sources.insert(source);
        }
    }
    Ok(sources)
}

fn setup_database<P: AsRef<Path>>(config_dir: &P) -> IoResult<SqliteConnection> {
    let database_path = config_dir.as_ref().join(DATABASE_FILE);
    let database_url = database_path.to_str().ok_or(IoError::new(
        IoErrorKind::InvalidFilename,
        "failed to convert path to string",
    ))?;

    let mut connection = SqliteConnection::establish(&database_url)
        .map_err(|error| IoError::new(IoErrorKind::Other, error))?;

    connection
        .run_pending_migrations(DATABASE_MIGRATIONS)
        .map_err(|error| IoError::new(IoErrorKind::Other, error))?;

    Ok(connection)
}
