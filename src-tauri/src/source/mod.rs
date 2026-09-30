use core::borrow::Borrow;
use core::cmp::Ordering;
use core::hash::{Hash, Hasher};

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

impl Borrow<Uuid> for MediaSource {
    #[inline]
    fn borrow(&self) -> &Uuid {
        &self.uuid
    }
}

impl PartialEq for MediaSource {
    #[inline]
    fn eq(&self, other: &Self) -> bool {
        self.uuid.eq(&other.uuid)
    }
}

impl Eq for MediaSource {}

impl PartialOrd for MediaSource {
    #[inline]
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.uuid.cmp(&other.uuid))
    }
}

impl Ord for MediaSource {
    #[inline]
    fn cmp(&self, other: &Self) -> Ordering {
        self.uuid.cmp(&other.uuid)
    }
}

impl Hash for MediaSource {
    #[inline]
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.uuid.hash(state);
    }
}
