use tauri::State;
use tauri::{AppHandle, Emitter};

use crate::AppData;

#[tauri::command]
pub fn swear(app: AppHandle, name: &str) -> String {
    app.emit("swear", "you are a donkey").unwrap();
    format!(
        "YOU FUCKING DONKEY, {} MAN! You've been sworn (?) from Rust!",
        name
    )
}

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub fn get_pb_creds(app_data: State<AppData>) -> String {
    format!("{}", app_data.admin_pass)
}
