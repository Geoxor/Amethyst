use serde::{Deserialize, Serialize};

pub mod jellyfin;
pub mod local;
pub mod subsonic;

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub enum MediaSource {
    Local(local::Local),
    Jellyfin(jellyfin::Jellyfin),
    Subsonic(subsonic::Subsonic),
}
