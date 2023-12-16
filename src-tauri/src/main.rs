// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[macro_use]
extern crate lazy_static;

use tauri::{CustomMenuItem, Menu, MenuItem, Submenu, AboutMetadata};
use discord_rich_presence::{activity, DiscordIpc, DiscordIpcClient};
use std::sync::{Arc, Mutex};

use tauri::api::dialog::FileDialogBuilder;
use std::path::PathBuf;

#[derive(Clone, serde::Serialize)]
struct FilePayload {
  files: Vec<PathBuf>,
}

#[derive(Clone, serde::Serialize)]
struct FolderPayload {
  folder: PathBuf
}

lazy_static! {
  static ref client: Mutex<DiscordIpcClient> = Mutex::new({
    let mut c = DiscordIpcClient::new("976036303156162570").unwrap();
    c
  });
}

#[tauri::command]
fn update_presence(title: String, time: String, format: String) {
  
  let assets = activity::Assets::new()
  .large_image("audio_file")
    .large_text(&format)
    .small_image("logo")
    // TODO: fetch version from native API
    .small_text("Amethyst v2.0.0 (Tauri)");

  let payload = activity::Activity::new()
    .state(&time)
    .details(&title)
    .assets(assets);
  
  client.lock().unwrap().set_activity(payload);
}

fn main() {

  client.lock().unwrap().connect();

  #[cfg(debug_assertions)]
  let menu = Menu::new()
    .add_submenu(Submenu::new("Amethyst", Menu::new().add_native_item(MenuItem::About("Amethyst".to_string(), AboutMetadata::new())).add_native_item(MenuItem::Separator).add_native_item(MenuItem::Quit)))
    .add_submenu(Submenu::new("File", Menu::new().add_item(CustomMenuItem::new("open_file".to_string(), "Open File").accelerator("Command+O")).add_item(CustomMenuItem::new("open_folder".to_string(), "Open Folder").accelerator("Command+Shift+O"))))
    .add_submenu(Submenu::new("Utility", Menu::new().add_item(CustomMenuItem::new("clear_queue".to_string(), "Clear queue").accelerator("Command+Shift+X")).add_item(CustomMenuItem::new("clear_invalid".to_string(), "Clear errored / deleted").accelerator("Command+Shift+Z")).add_native_item(MenuItem::Separator).add_item(CustomMenuItem::new("refresh_metadata".to_string(), "Refresh all metadata").accelerator("Command+Alt+R")).add_item(CustomMenuItem::new("refresh_window".to_string(), "Refresh window").accelerator("Command+R"))))
    .add_submenu(Submenu::new("View", Menu::new().add_item(CustomMenuItem::new("settings".to_string(), "Settings").accelerator("Command+S"))))
    .add_submenu(Submenu::new("Window", Menu::new().add_native_item(MenuItem::Minimize).add_native_item(MenuItem::Zoom).add_native_item(MenuItem::CloseWindow).add_native_item(MenuItem::Separator).add_native_item(MenuItem::ShowAll)))
    .add_submenu(Submenu::new("Debug", Menu::new().add_item(CustomMenuItem::new("debug".to_string(), "Developer tools").accelerator("Command+D"))))
    .add_submenu(Submenu::new("About", Menu::new().add_item(CustomMenuItem::new("documentation".to_string(), "Go to Documentation")).add_item(CustomMenuItem::new("github".to_string(), "Go to Github")).add_item(CustomMenuItem::new("discord".to_string(), "Join Discord Server"))));

  #[cfg(not(debug_assertions))]
  let menu = Menu::new()
    .add_submenu(Submenu::new("Amethyst", Menu::new().add_native_item(MenuItem::About("Amethyst".to_string(), AboutMetadata::new())).add_native_item(MenuItem::Separator).add_native_item(MenuItem::Quit)))
    .add_submenu(Submenu::new("File", Menu::new().add_item(CustomMenuItem::new("open_file".to_string(), "Open File").accelerator("Command+O")).add_item(CustomMenuItem::new("open_folder".to_string(), "Open Folder").accelerator("Command+Shift+O"))))
    .add_submenu(Submenu::new("Utility", Menu::new().add_item(CustomMenuItem::new("clear_queue".to_string(), "Clear queue").accelerator("Command+Shift+X")).add_item(CustomMenuItem::new("clear_invalid".to_string(), "Clear errored / deleted").accelerator("Command+Shift+Z")).add_native_item(MenuItem::Separator).add_item(CustomMenuItem::new("refresh_metadata".to_string(), "Refresh all metadata").accelerator("Command+Alt+R")).add_item(CustomMenuItem::new("refresh_window".to_string(), "Refresh window").accelerator("Command+R"))))
    .add_submenu(Submenu::new("View", Menu::new().add_item(CustomMenuItem::new("settings".to_string(), "Settings").accelerator("Command+S"))))
    .add_submenu(Submenu::new("Window", Menu::new().add_native_item(MenuItem::Minimize).add_native_item(MenuItem::Zoom).add_native_item(MenuItem::CloseWindow).add_native_item(MenuItem::Separator).add_native_item(MenuItem::ShowAll)))
    .add_submenu(Submenu::new("About", Menu::new().add_item(CustomMenuItem::new("documentation".to_string(), "Go to Documentation")).add_item(CustomMenuItem::new("github".to_string(), "Go to Github")).add_item(CustomMenuItem::new("discord".to_string(), "Join Discord Server"))));

  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![update_presence])
    .menu(menu)
    .on_menu_event(|event| {
      match event.menu_item_id() {
        "open_file" => {
          FileDialogBuilder::new().add_filter("Music", &[
            "ogg", 
            "ogv", 
            "oga", 
            "ogx", 
            "ogm", 
            "spx", 
            "opus", 
            "wav", 
            "wave", 
            "m4a", 
            "m4b", 
            "m4p", 
            "m4r", 
            "m4v", 
            "3gp", 
            "flac", 
            "opus", 
            "aac", 
            "aiff", 
            "mp3", 
            "m4a",
            "mp4",
            "dfpwm",
            "webm",
          ]).pick_files(move |file_paths| {
            event.window().emit("open-file", FilePayload { files: file_paths.unwrap() }).unwrap();
          })
        },
        "open_folder" => {
          FileDialogBuilder::new().pick_folder(move |folder_path| {
            event.window().emit("open-folder", FolderPayload { folder: folder_path.unwrap() }).unwrap();
          })
        },
        "settings" => {
          event.window().emit("goto-settings", {}).unwrap();
        },
        "debug" => {
          #[cfg(debug_assertions)]
          event.window().open_devtools();
        },
        "clear_queue" => {
          event.window().emit("clear-queue", {}).unwrap();
        },
        "clear_invalid" => {
          event.window().emit("clear-error", {}).unwrap();
        },
        "refresh_metadata" => {
          event.window().emit("refresh-metadata", {}).unwrap();
        },
        "documentation" => {
          open::that("https://amethyst.pages.dev/introduction.html");
        },
        "github" => {
          open::that("https://rust-lang.org");
        },
        "discord" => {
          open::that("https://github.com/Nyabsi/Amethyst/tree/tauri");
        },
        id => {
          println!("got menu event: {}", id);
        }
      }
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
