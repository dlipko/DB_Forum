DROP INDEX IF EXISTS index_users_on_email;
DROP INDEX IF EXISTS index_users_on_nickname;
DROP INDEX IF EXISTS index_forum_on_slug;
DROP INDEX IF EXISTS index_threads_on_author_id;
DROP INDEX IF EXISTS index_threads_on_forum_id;
DROP INDEX IF EXISTS index_threads_on_slug;
DROP INDEX IF EXISTS index_posts_on_author_id;
DROP INDEX IF EXISTS index_posts_on_forum_id;
DROP INDEX IF EXISTS index_posts_on_parent;
DROP INDEX IF EXISTS index_posts_on_thread_id;
DROP INDEX IF EXISTS index_posts_on_path;
DROP INDEX IF EXISTS index_votes_on_user_id_and_thread_id;
DROP INDEX IF EXISTS index_forum_members_on_user_id;

DROP TRIGGER IF EXISTS on_vote_update ON votes;
DROP TRIGGER IF EXISTS on_vote_insert ON votes;

DROP FUNCTION IF EXISTS vote_insert();
DROP FUNCTION IF EXISTS vote_update();

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS forums CASCADE;
DROP TABLE IF EXISTS threads CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS forum_members CASCADE;


CREATE TABLE IF NOT EXISTS users (
  nickname VARCHAR  NOT NULL,
  fullname VARCHAR NOT NULL,
  email    VARCHAR  NOT NULL,
  about    TEXT,
  CONSTRAINT users_pkey PRIMARY KEY (nickname)
);

CREATE UNIQUE INDEX index_users_on_nickname
  ON users (LOWER(nickname));

CREATE UNIQUE INDEX index_users_on_email
  ON users (LOWER(email));


CREATE TABLE IF NOT EXISTS forums (
  id      BIGSERIAL PRIMARY KEY,
  posts   INT   NOT NULL DEFAULT 0,
  slug    TEXT  NOT NULL,
  threads INT   NOT NULL DEFAULT 0,
  title   TEXT  NOT NULL,
  "user"  TEXT  NOT NULL REFERENCES users(nickname)
);

CREATE UNIQUE INDEX index_forum_on_slug
  ON forums (LOWER(slug));

CREATE INDEX index_forum_on_user
  ON forums (lower("user"));

CREATE TABLE IF NOT EXISTS threads (
  id        BIGSERIAL PRIMARY KEY,
  author    TEXT        NOT NULL  REFERENCES users(nickname),
  created   TIMESTAMPTZ NOT NULL,
  forum     TEXT        NOT NULL,
  message   TEXT        NOT NULL,
  slug      TEXT        DEFAULT NULL UNIQUE,
  title     TEXT        NOT NULL,
  votes     INT         NOT NULL DEFAULT 0
);


CREATE INDEX index_threads_on_forum
  ON threads (lower(forum));

CREATE UNIQUE INDEX index_threads_on_slug
  ON threads (LOWER(slug));


CREATE TABLE IF NOT EXISTS posts (
  id        BIGSERIAL PRIMARY KEY,
  author    TEXT NOT NULL REFERENCES users(nickname),
  created   TIMESTAMPTZ  DEFAULT transaction_timestamp()  NOT NULL,
  forum     TEXT NOT NULL,
  is_edited BOOLEAN DEFAULT FALSE,
  message   TEXT NOT NULL,
  parent    BIGINT DEFAULT 0 NOT NULL,
  -- path      BIGINT []                      NOT NULL,
  path      BIGINT [],
  rootParent BIGINT DEFAULT 0,
  thread_id BIGINT NOT NULL
);

CREATE INDEX index_posts_on_thread_id_and_id
  ON posts(thread_id, id);

CREATE INDEX index_posts_on_parent
  ON posts (parent);

CREATE INDEX index_posts_on_thread_id
  ON posts (thread_id);

CREATE INDEX index_posts_thread_path_parent
  ON posts(thread_id, parent, path);

CREATE INDEX index_posts_on_thread_id_and_path_and_id
  ON posts (thread_id, path ,id);


CREATE TABLE IF NOT EXISTS votes (
  nickname VARCHAR  NOT NULL REFERENCES users(nickname),
  thread_id BIGINT REFERENCES threads (id) NOT NULL,
  voice     SMALLINT                       NOT NULL,
  PRIMARY KEY (nickname, thread_id)
);


CREATE UNIQUE INDEX index_votes_on_user_id_and_thread_id
  ON votes (nickname, thread_id);


CREATE FUNCTION vote_insert()
  RETURNS TRIGGER AS '
BEGIN
  UPDATE threads
  SET
    votes = votes + NEW.voice
  WHERE id = NEW.thread_id;
  RETURN NULL;
END;
' LANGUAGE plpgsql;


CREATE TRIGGER on_vote_insert
AFTER INSERT ON votes
FOR EACH ROW EXECUTE PROCEDURE vote_insert();

CREATE FUNCTION vote_update()
  RETURNS TRIGGER AS '
BEGIN
  IF OLD.voice = NEW.voice
  THEN
    RETURN NULL;
  END IF;
  UPDATE threads
  SET
    votes = votes + CASE WHEN NEW.voice = -1
      THEN -2
                    ELSE 2 END
  WHERE id = NEW.thread_id;
  RETURN NULL;
END;
' LANGUAGE plpgsql;

CREATE TRIGGER on_vote_update
AFTER UPDATE ON votes
FOR EACH ROW EXECUTE PROCEDURE vote_update();

-- CREATE TABLE IF NOT EXISTS forum_members (
--   user_id  BIGINT REFERENCES users (id),
--   forum_id BIGINT REFERENCES forums (id)
-- );

-- CREATE INDEX index_forum_members_on_user_id
--   ON forum_members(user_id);

-- CREATE INDEX index_forum_members_on_forum_id
--   ON forum_members(forum_id);

-- CREATE INDEX index_forum_members_on_user_id_forum_id
--   ON forum_members (user_id, forum_id);


-- CREATE OR REPLACE FUNCTION forum_members_update()
--   RETURNS TRIGGER AS '
-- BEGIN
--   INSERT INTO forum_members (user_id, forum_id) VALUES ((SELECT id FROM users WHERE lower(NEW.author) = lower(nickname)),
--                                                         (SELECT id FROM forums WHERE lower(NEW.forum) = lower(slug)));
--   RETURN NULL;
-- END;
-- ' LANGUAGE plpgsql;


-- CREATE TRIGGER on_post_insert
-- AFTER INSERT ON posts
-- FOR EACH ROW EXECUTE PROCEDURE forum_members_update();

-- CREATE TRIGGER on_thread_insert
-- AFTER INSERT ON threads
-- FOR EACH ROW EXECUTE PROCEDURE forum_members_update();