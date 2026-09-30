use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Subsonic {
    pub url: String,
    pub username: String,
    pub password: String,
}
