CREATE TABLE artists (
    id   INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name TEXT    NOT NULL COLLATE NOCASE UNIQUE
);

CREATE TABLE albums (
    id   INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name TEXT    NOT NULL,
    year INTEGER
);

CREATE TABLE genres (
    id   INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name TEXT    NOT NULL COLLATE NOCASE UNIQUE
);

CREATE TABLE tracks (
    id           INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    title        TEXT,
    bpm          INTEGER,
    isrc         TEXT,
    barcode      TEXT,
    label        TEXT,
    copyright    TEXT
);

CREATE TABLE containers (
    id        INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name      TEXT    NOT NULL COLLATE NOCASE UNIQUE,
    mime_type TEXT    NOT NULL
);

CREATE TABLE codecs (
    id   INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name TEXT    NOT NULL COLLATE NOCASE UNIQUE
);

CREATE TABLE playback_reason (
    id     INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    reason TEXT NOT NULL COLLATE NOCASE UNIQUE
);

CREATE TABLE track_files (
    id              INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    track_id        INTEGER,
    container_id    INTEGER,
    codec_id        INTEGER,
    source          TEXT NOT NULL, -- UUID
    source_id       TEXT NOT NULL, -- Path (local) or ID (remote)
    duration        REAL,          -- seconds, fractional
    size            INTEGER,       -- bytes
    bit_rate        INTEGER,       -- bits per second
    sample_rate     INTEGER,       -- Hz
    bits_per_sample INTEGER,
    channels        INTEGER,
    added_at        TEXT NOT NULL, -- ISO-8601 timestamp
    FOREIGN KEY (track_id)     REFERENCES tracks     (id) ON DELETE SET NULL,
    FOREIGN KEY (container_id) REFERENCES containers (id) ON DELETE SET NULL,
    FOREIGN KEY (codec_id)     REFERENCES codecs     (id) ON DELETE SET NULL,
    UNIQUE (source, source_id)
);

CREATE TABLE album_artists (
    album_id  INTEGER NOT NULL,
    artist_id INTEGER NOT NULL,
    PRIMARY KEY (album_id, artist_id),
    FOREIGN KEY (album_id)  REFERENCES albums  (id) ON DELETE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES artists (id) ON DELETE CASCADE
);

CREATE TABLE album_genres (
    album_id INTEGER NOT NULL,
    genre_id INTEGER NOT NULL,
    PRIMARY KEY (album_id, genre_id),
    FOREIGN KEY (album_id) REFERENCES albums (id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres (id) ON DELETE CASCADE
);

CREATE TABLE track_artists (
    track_id  INTEGER NOT NULL,
    artist_id INTEGER NOT NULL,
    position  INTEGER NOT NULL,
    PRIMARY KEY (track_id, artist_id),
    FOREIGN KEY (track_id)  REFERENCES tracks  (id) ON DELETE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES artists (id) ON DELETE CASCADE
);

CREATE TABLE track_genres (
    track_id INTEGER NOT NULL,
    genre_id INTEGER NOT NULL,
    PRIMARY KEY (track_id, genre_id),
    FOREIGN KEY (track_id) REFERENCES tracks (id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres (id) ON DELETE CASCADE
);

CREATE TABLE album_tracks (
    album_id     INTEGER NOT NULL,
    track_id     INTEGER,
    disc_number  INTEGER NOT NULL DEFAULT 1,
    track_number INTEGER NOT NULL,
    PRIMARY KEY (album_id, disc_number, track_number),
    FOREIGN KEY (album_id) REFERENCES albums (id) ON DELETE CASCADE,
    FOREIGN KEY (track_id) REFERENCES tracks (id) ON DELETE SET NULL
);

CREATE TABLE playback_history (
    id           INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    track_id     INTEGER NOT NULL,
    reason_id    INTEGER,
    played_at    TEXT NOT NULL,
    FOREIGN KEY (track_id)  REFERENCES tracks          (id) ON DELETE CASCADE,
    FOREIGN KEY (reason_id) REFERENCES playback_reason (id) ON DELETE SET NULL
);

CREATE TABLE favorites (
    id       INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    track_id INTEGER NOT NULL,
    added_at TEXT    NOT NULL,
    FOREIGN KEY (track_id) REFERENCES tracks (id) ON DELETE CASCADE
);

INSERT INTO playback_reason (reason) VALUES ('play'), ('skip');

CREATE INDEX idx_track_files_track_id ON track_files (track_id);
