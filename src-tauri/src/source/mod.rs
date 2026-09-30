use serde::{Deserialize, Serialize};
use uuid::Uuid;

pub mod jellyfin;
pub mod local;
pub mod subsonic;

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct MediaSource {
    pub uuid: Uuid,
    pub name: Option<String>,
    #[serde(flatten)]
    pub data: MediaSourceData,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum MediaSourceData {
    Local(local::Local),
    Jellyfin(jellyfin::Jellyfin),
    Subsonic(subsonic::Subsonic),
}
