// @generated automatically by Diesel CLI.

diesel::table! {
    album_artists (album_id, artist_id) {
        album_id -> Integer,
        artist_id -> Integer,
    }
}

diesel::table! {
    album_genres (album_id, genre_id) {
        album_id -> Integer,
        genre_id -> Integer,
    }
}

diesel::table! {
    album_tracks (album_id, disc_number, track_number) {
        album_id -> Integer,
        track_id -> Nullable<Integer>,
        disc_number -> Integer,
        track_number -> Integer,
    }
}

diesel::table! {
    albums (id) {
        id -> Integer,
        name -> Text,
        year -> Nullable<Integer>,
    }
}

diesel::table! {
    artists (id) {
        id -> Integer,
        name -> Text,
    }
}

diesel::table! {
    codecs (id) {
        id -> Integer,
        name -> Text,
    }
}

diesel::table! {
    containers (id) {
        id -> Integer,
        name -> Text,
        mime_type -> Text,
    }
}

diesel::table! {
    favorites (id) {
        id -> Integer,
        track_id -> Integer,
        added_at -> Text,
    }
}

diesel::table! {
    genres (id) {
        id -> Integer,
        name -> Text,
    }
}

diesel::table! {
    playback_history (id) {
        id -> Integer,
        track_id -> Integer,
        reason_id -> Nullable<Integer>,
        played_at -> Text,
    }
}

diesel::table! {
    playback_reason (id) {
        id -> Integer,
        reason -> Text,
    }
}

diesel::table! {
    track_artists (track_id, artist_id) {
        track_id -> Integer,
        artist_id -> Integer,
        position -> Integer,
    }
}

diesel::table! {
    track_files (id) {
        id -> Integer,
        track_id -> Nullable<Integer>,
        container_id -> Nullable<Integer>,
        codec_id -> Nullable<Integer>,
        source -> Text,
        source_id -> Text,
        duration -> Nullable<Float>,
        size -> Nullable<Integer>,
        bit_rate -> Nullable<Integer>,
        sample_rate -> Nullable<Integer>,
        bits_per_sample -> Nullable<Integer>,
        channels -> Nullable<Integer>,
        added_at -> Text,
    }
}

diesel::table! {
    track_genres (track_id, genre_id) {
        track_id -> Integer,
        genre_id -> Integer,
    }
}

diesel::table! {
    tracks (id) {
        id -> Integer,
        title -> Nullable<Text>,
        bpm -> Nullable<Integer>,
        isrc -> Nullable<Text>,
        barcode -> Nullable<Text>,
        label -> Nullable<Text>,
        copyright -> Nullable<Text>,
    }
}

diesel::joinable!(album_artists -> albums (album_id));
diesel::joinable!(album_artists -> artists (artist_id));
diesel::joinable!(album_genres -> albums (album_id));
diesel::joinable!(album_genres -> genres (genre_id));
diesel::joinable!(album_tracks -> albums (album_id));
diesel::joinable!(album_tracks -> tracks (track_id));
diesel::joinable!(favorites -> tracks (track_id));
diesel::joinable!(playback_history -> playback_reason (reason_id));
diesel::joinable!(playback_history -> tracks (track_id));
diesel::joinable!(track_artists -> artists (artist_id));
diesel::joinable!(track_artists -> tracks (track_id));
diesel::joinable!(track_files -> codecs (codec_id));
diesel::joinable!(track_files -> containers (container_id));
diesel::joinable!(track_files -> tracks (track_id));
diesel::joinable!(track_genres -> genres (genre_id));
diesel::joinable!(track_genres -> tracks (track_id));

diesel::allow_tables_to_appear_in_same_query!(
    album_artists,
    album_genres,
    album_tracks,
    albums,
    artists,
    codecs,
    containers,
    favorites,
    genres,
    playback_history,
    playback_reason,
    track_artists,
    track_files,
    track_genres,
    tracks,
);
