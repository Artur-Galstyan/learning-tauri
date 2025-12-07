use tauri::Manager;
use tauri_plugin_shell::ShellExt;
use uuid::Uuid;
pub mod commands;

pub struct AppData {
    admin_pass: String,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_websocket::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let admin_pass = Uuid::new_v4().to_string();
            app.manage(AppData {
                admin_pass: admin_pass.clone(),
            });

            let admin_cmd = app.shell().sidecar("pocketbase").unwrap().args([
                "superuser",
                "upsert",
                "admin@app.local",
                &admin_pass.clone(),
            ]);
            admin_cmd.spawn().expect("Failed to create admin");
            let sidecar_command = app.shell().sidecar("pocketbase").unwrap().args(["serve"]);
            sidecar_command.spawn().expect("Failed to spawn sidecar");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::greet,
            commands::swear,
            commands::get_pb_creds
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
