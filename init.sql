DROP TABLE IF EXISTS posts CASCADE;

CREATE EXTENSION IF NOT EXISTS CITEXT;


DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE IF NOT EXISTS users (
  nickname CITEXT  COLLATE ucs_basic NOT NULL PRIMARY KEY,
  fullname CITEXT NOT NULL,
  email    CITEXT  NOT NULL,
  about    TEXT
);

DROP INDEX IF EXISTS index_users_on_nickname;
CREATE UNIQUE INDEX index_users_on_nickname
  ON users (nickname);

DROP INDEX IF EXISTS index_users_on_email;
CREATE UNIQUE INDEX index_users_on_email
  ON users (email);


DROP TABLE IF EXISTS forums CASCADE;
CREATE TABLE IF NOT EXISTS forums (
  id      BIGSERIAL PRIMARY KEY,
  posts   INT   NOT NULL DEFAULT 0,
  slug    CITEXT  NOT NULL,
  threads INT   NOT NULL DEFAULT 0,
  title   CITEXT  NOT NULL,
  "user"  CITEXT  NOT NULL REFERENCES users(nickname)
);

DROP INDEX IF EXISTS index_forum_on_slug;
CREATE UNIQUE INDEX index_forum_on_slug
  ON forums (slug);

DROP INDEX IF EXISTS index_forum_on_user;
CREATE INDEX index_forum_on_user
  ON forums ("user");


DROP TABLE IF EXISTS threads CASCADE;
CREATE TABLE IF NOT EXISTS threads (
  id        BIGSERIAL PRIMARY KEY,
  author    CITEXT        NOT NULL  REFERENCES users(nickname),
  created   TIMESTAMPTZ NOT NULL,
  forum     CITEXT        NOT NULL,
  message   TEXT        NOT NULL,
  slug      CITEXT        DEFAULT NULL UNIQUE,
  title     CITEXT        NOT NULL,
  votes     INT         NOT NULL DEFAULT 0
);

DROP INDEX IF EXISTS index_threads_on_forum;
CREATE INDEX index_threads_on_forum
  ON threads (forum);

DROP INDEX IF EXISTS index_threads_on_slug;
CREATE UNIQUE INDEX index_threads_on_slug
  ON threads (slug);

DROP FUNCTION IF EXISTS thread_insert_update_forums();
CREATE FUNCTION thread_insert_update_forums()
  RETURNS TRIGGER AS '
BEGIN
  UPDATE forums
  SET
    threads = threads + 1
  WHERE slug = NEW.forum;
  RETURN NULL;
END;
' LANGUAGE plpgsql;


CREATE TRIGGER on_thread_insert_update_forums
AFTER INSERT ON threads
FOR EACH ROW EXECUTE PROCEDURE thread_insert_update_forums();



CREATE TABLE IF NOT EXISTS posts (
  id        BIGSERIAL PRIMARY KEY,
  author    CITEXT NOT NULL REFERENCES users(nickname),
  created   TIMESTAMPTZ  DEFAULT transaction_timestamp()  NOT NULL,
  forum     CITEXT NOT NULL,
  is_edited BOOLEAN DEFAULT FALSE,
  message   CITEXT NOT NULL,
  parent    BIGINT DEFAULT 0 NOT NULL,
  path      BIGINT []               DEFAULT ARRAY [] :: BIGINT [],
  root BIGINT DEFAULT 0,
  thread BIGINT NOT NULL
);

DROP INDEX IF EXISTS index_posts_on_thread_and_id;
CREATE INDEX index_posts_on_thread_and_id
  ON posts(thread, id);

DROP INDEX IF EXISTS index_posts_on_parent;
CREATE INDEX index_posts_on_parent
  ON posts (parent);

DROP INDEX IF EXISTS index_posts_on_thread;
CREATE INDEX index_posts_on_thread
  ON posts (thread);

DROP INDEX IF EXISTS index_posts_thread_path_parent;
CREATE INDEX index_posts_thread_path_parent
  ON posts(thread, parent, path);

DROP INDEX IF EXISTS index_posts_on_thread_and_path_and_id;
CREATE INDEX index_posts_on_thread_and_path_and_id
  ON posts (thread, path ,id);


DROP FUNCTION IF EXISTS post_insert_update_forums();
CREATE FUNCTION post_insert_update_forums()
  RETURNS TRIGGER AS '
BEGIN
  UPDATE forums
  SET
    posts = posts + 1
  WHERE slug = NEW.forum;
  RETURN NULL;
END;
' LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS on_post_insert_update_forums ON posts;
CREATE TRIGGER on_post_insert_update_forums
AFTER INSERT ON posts
FOR EACH ROW EXECUTE PROCEDURE post_insert_update_forums();



DROP FUNCTION IF EXISTS post_insert_check_parent_forum();
CREATE FUNCTION post_insert_check_parent_forum()
  RETURNS TRIGGER AS '
BEGIN
  IF NEW.parent != 0 
  THEN
    IF NEW.forum = (SELECT forum FROM posts WHERE id = NEW.parent) 
    THEN
      return NEW;
    ELSE
      RAISE division_by_zero;
    END IF;
  END IF;
  RETURN NEW;
END;
' LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_post_insert_check_parent_forum ON posts;
CREATE TRIGGER on_post_insert_check_parent_forum
BEFORE INSERT ON posts
FOR EACH ROW EXECUTE PROCEDURE post_insert_check_parent_forum();


DROP FUNCTION IF EXISTS post_insert_update_post_path_root();
CREATE OR REPLACE FUNCTION post_insert_update_post_path_root()
  RETURNS TRIGGER AS '
DECLARE 
    parent_root INTEGER;
    parent_path BIGINT [];
BEGIN
  SELECT root, path INTO parent_root, parent_path
  FROM posts 
  WHERE id = NEW.parent;

  IF NEW.parent = 0 THEN
    NEW.root = NEW.id;
  ELSE
    NEW.root = parent_root;
  END IF;

  NEW.path = array_append(parent_path, NEW.id);

  RETURN NEW;
END;
' LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_post_insert_update_path_root ON posts;
CREATE TRIGGER on_post_insert_update_path_root
BEFORE INSERT ON posts
FOR EACH ROW EXECUTE PROCEDURE post_insert_update_post_path_root();


DROP TABLE IF EXISTS votes CASCADE;
CREATE TABLE IF NOT EXISTS votes (
  nickname CITEXT  NOT NULL REFERENCES users(nickname),
  thread BIGINT REFERENCES threads (id) NOT NULL,
  voice     SMALLINT                       NOT NULL,
  PRIMARY KEY (nickname, thread)
);

DROP INDEX IF EXISTS index_votes_on_nickname_and_thread;
CREATE UNIQUE INDEX index_votes_on_nickname_and_thread
  ON votes (nickname, thread);



DROP FUNCTION IF EXISTS vote_insert();
CREATE FUNCTION vote_insert()
  RETURNS TRIGGER AS '
BEGIN
  UPDATE threads
  SET
    votes = votes + NEW.voice
  WHERE id = NEW.thread;
  RETURN NULL;
END;
' LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS on_vote_insert ON votes;
CREATE TRIGGER on_vote_insert
AFTER INSERT ON votes
FOR EACH ROW EXECUTE PROCEDURE vote_insert();

DROP FUNCTION IF EXISTS vote_update();
CREATE FUNCTION vote_update()
  RETURNS TRIGGER AS '
BEGIN
  IF OLD.voice = NEW.voice THEN
    RETURN NULL;
  END IF;
  UPDATE threads
  SET votes = votes + CASE WHEN NEW.voice = -1 THEN -2 ELSE 2 END
  WHERE id = NEW.thread;
  RETURN NULL;
END;
' LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_vote_update ON votes;
CREATE TRIGGER on_vote_update
AFTER UPDATE ON votes
FOR EACH ROW EXECUTE PROCEDURE vote_update();