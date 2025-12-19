use std::error::Error;

use crate::constants::ADMIN_EMAIL;
use crate::constants::POCKETBASE_URL;
use crate::AppData;
use serde::Deserialize;
use serde::Serialize;

#[derive(Serialize)]
struct AuthRequest {
    identity: String,
    password: String,
}

#[derive(Deserialize)]
pub struct AuthResponse {
    pub token: String,
}

pub fn get_superadmin_auth_token(app_data: &AppData) -> Result<AuthResponse, Box<dyn Error>> {
    let client = reqwest::blocking::Client::new();

    let super_user_url = format!(
        "{}/api/collections/_superusers/auth-with-password",
        POCKETBASE_URL
    );
    let auth_request = AuthRequest {
        identity: ADMIN_EMAIL.to_string(),
        password: app_data.admin_pass.clone(),
    };

    let response = client.post(super_user_url).json(&auth_request).send()?;
    let auth: AuthResponse = response.json()?;
    Ok(auth)
}
