use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Jellyfin {
    pub uuid: Uuid,
    pub url: String,
    pub username: String,
    pub password: String,
    pub scrobble: bool,
}
