--#1
CREATE TABLE users(
id                    SERIAL PRIMARY KEY,
first_name            TEXT,
last_name             TEXT,
profile_pic_url       TEXT,
email_address         TEXT,
password              TEXT,
created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


--#2
CREATE TABLE podcast_episodes(
id                    SERIAL PRIMARY KEY,
name                  TEXT,
episode_number        INTEGER,
description           TEXT,
artwork_filename           TEXT,
duration_in_minutes   INTEGER,
podcast_ext_url       TEXT,
podcast_series_id     INTEGER,
created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--#3
--Many to many Join table for listeners and podcasts episodes
CREATE TABLE listener_podcast_episodes(
id                  SERIAL PRIMARY KEY,
favourited          BOOLEAN,
listener_id         INTEGER,
podcast_episode_id  INTEGER, 
created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--#4
--Many to many Join table for creators and podcasts episodes
CREATE TABLE creator_podcast_episodes(
id                 SERIAL PRIMARY KEY,
creator_id         INTEGER,
podcast_episode_id INTEGER, 
created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--#5
--Many to many Join table for user and podcasts episode on comments
CREATE TABLE user_episode_comments(
id                 SERIAL PRIMARY KEY,
comment            TEXT,
podcast_episode_id INTEGER, 
poster_id          INTEGER,
created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--#6
--1 to many Join table for between comments join table above and users on favoriting a comment
CREATE TABLE favourite_comments(
id                          SERIAL PRIMARY KEY,
user_episode_comment_id     INTEGER,
user_id                     INTEGER, 
created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--#7
--Many to many join table between podcast_episode and playlist
CREATE TABLE episode_playlists(
id                          SERIAL PRIMARY KEY,
podcast_episode_id          INTEGER,
playlist_id                 INTEGER, 
created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--#8
CREATE TABLE playlists(
id                          SERIAL PRIMARY KEY,
name                        TEXT,
description                 TEXT, 
created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--#9
CREATE TABLE podcast_series(
id                    SERIAL PRIMARY KEY,
name                  TEXT,
description           TEXT,
artwork_filename      TEXT,
created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--#10
--Many to many join table between podcast_series and subgenre
CREATE TABLE podcast_series_subgenres(
id                    SERIAL PRIMARY KEY,
podcast_series_id     INTEGER,
subgenre_id           INTEGER,
created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--#11
CREATE TABLE subgenres(
id                    SERIAL PRIMARY KEY,
name                  TEXT,
description           TEXT,
genre_id              INTEGER,
created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--#12
CREATE TABLE genres(
id                    SERIAL PRIMARY KEY,
name                  TEXT,
description           TEXT,
created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--#13
CREATE TABLE friendships(
id                    SERIAL PRIMARY KEY,
user1_id              INTEGER,
user2_id              INTEGER,
created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);