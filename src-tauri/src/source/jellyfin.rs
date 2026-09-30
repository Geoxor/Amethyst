use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Jellyfin {
    pub url: String,
    pub username: String,
    pub password: String,
    pub scrobble: bool,
}
