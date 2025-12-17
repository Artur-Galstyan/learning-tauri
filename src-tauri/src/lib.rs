use tauri::Manager;
use tauri_plugin_shell::ShellExt;
use uuid::Uuid;
pub mod commands;
mod constants;

pub struct AppData {
    admin_pass: String,
    vault_pass: String,
}

fn get_or_create_vault_password() -> String {
    let entry =
        keyring::Entry::new("regulaid", "vault-password").expect("Failed to create keyring entry");

    match entry.get_password() {
        Ok(password) => {
            println!("Found existing password in keyring!");
            password
        }
        Err(e) => {
            println!("Keyring error: {:?}", e);
            let vault_pass = Uuid::new_v4().to_string();
            entry
                .set_password(&vault_pass)
                .expect("Failed to save password to keyring");
            vault_pass
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_websocket::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let admin_pass = Uuid::new_v4().to_string();
            let vault_pass = get_or_create_vault_password();
            app.manage(AppData {
                admin_pass: admin_pass.clone(),
                vault_pass: vault_pass.clone(),
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

            let app_data_dir = app
                .path()
                .app_local_data_dir()
                .expect("could not resolve app local data path");

            std::fs::create_dir_all(&app_data_dir).expect("Failed to create app data directory");

            let salt_path = app_data_dir.join("salt.txt");
            app.handle()
                .plugin(tauri_plugin_stronghold::Builder::with_argon2(&salt_path).build())?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::greet,
            commands::swear,
            commands::get_pb_creds,
            commands::get_vault_creds,
            commands::auth_with_password
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
