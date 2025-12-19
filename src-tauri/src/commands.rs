use serde::Deserialize;
use serde::Serialize;
use tauri::State;
use tauri::{AppHandle, Emitter};

use crate::auth_utils::get_superadmin_auth_token;
use crate::constants::POCKETBASE_URL;
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

#[tauri::command]
pub fn get_vault_creds(app_data: State<AppData>) -> String {
    format!("{}", app_data.vault_pass)
}

#[derive(Serialize)]
struct RegisterRequest {
    email: String,
    password: String,
    password_confirm: String,
}

#[derive(Serialize)]
struct LoginRequest {
    identity: String,
    password: String,
}

#[tauri::command]
pub fn register_with_password(
    app_data: State<AppData>,
    email: String,
    password: String,
    password_confirm: String,
) -> String {
    let auth = get_superadmin_auth_token(&app_data);
    let auth_token = match auth {
        Ok(response) => response.token,
        Err(e) => {
            return format!("Error: {}", e);
        }
    };

    let body = RegisterRequest {
        email,
        password,
        password_confirm,
    };

    let url = format!("{}/api/collections/users/records", POCKETBASE_URL);

    let client = reqwest::blocking::Client::new();
    let response = client.post(url).json(&body).bearer_auth(auth_token).send();

    match response {
        Ok(res) => res
            .text()
            .unwrap_or_else(|_| "Failed to read response".into()),
        Err(e) => format!("Request failed: {}", e),
    }
}

#[tauri::command]
pub fn auth_with_password(
    app_data: State<AppData>,
    user_email: String,
    password: String,
) -> String {
    let auth = get_superadmin_auth_token(&app_data);
    let auth_token = match auth {
        Ok(response) => response.token,
        Err(e) => {
            return format!("Error: {}", e);
        }
    };

    let body = LoginRequest {
        identity: user_email,
        password,
    };

    let url = format!(
        "{}/api/collections/users/auth-with-password",
        POCKETBASE_URL
    );

    let client = reqwest::blocking::Client::new();
    let response = client.post(url).json(&body).bearer_auth(auth_token).send();

    match response {
        Ok(res) => res
            .text()
            .unwrap_or_else(|_| "Failed to read response".into()),
        Err(e) => format!("Request failed: {}", e),
    }
}
