use serde::Deserialize;
use serde::Serialize;
use tauri::State;
use tauri::{AppHandle, Emitter};

use crate::constants::ADMIN_EMAIL;
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
struct LoginRequest {
    identity: String,
    password: String,
}

#[derive(Serialize)]
struct AuthRequest {
    identity: String,
    password: String,
}

#[derive(Deserialize)]
struct AuthResponse {
    token: String,
}

#[tauri::command]
pub fn auth_with_password(
    app_data: State<AppData>,
    user_email: String,
    password: String,
) -> String {
    let client = reqwest::blocking::Client::new();

    let super_user_url = format!(
        "{}/api/collections/_superusers/auth-with-password",
        POCKETBASE_URL
    );
    let auth_request = AuthRequest {
        identity: ADMIN_EMAIL.to_string(),
        password: app_data.admin_pass.clone(),
    };

    let response = client.post(super_user_url).json(&auth_request).send();

    let res = match response {
        Ok(res) => res,
        Err(e) => return format!("Request failed: {}", e),
    };

    let auth: AuthResponse = match res.json() {
        Ok(data) => data,
        Err(e) => return format!("Failed to parse JSON: {}", e),
    };

    let body = LoginRequest {
        identity: user_email,
        password,
    };

    let url = format!(
        "{}/api/collections/users/auth-with-password",
        POCKETBASE_URL
    );
    let response = client.post(url).json(&body).bearer_auth(auth.token).send();

    match response {
        Ok(res) => res
            .text()
            .unwrap_or_else(|_| "Failed to read response".into()),
        Err(e) => format!("Request failed: {}", e),
    }
}
