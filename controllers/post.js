import Post from '../models/post';
import query from '../db/query';

export default class PostController {
  constructor() {}

  async createPosts(posts, thread, forum) {
    const created = new Date().toISOString();
    let sqlQuery = `INSERT INTO posts 
    (author, created, forum, is_edited, message, parent, path, thread_id)
    VALUES `;
      for (const post in posts) {
        sqlQuery += `((SELECT u.nickname FROM users u WHERE lower(u.nickname) = lower('${post.author}')), ${created}::TIMESTAMPTZ,
        (SELECT f.slug FROM forums f WHERE lower(f.slug) = lower('${forum.getSlug()}')), 1, '${post.message}', 42, 
        (SELECT id FROM posts WHERE id = ${post.getParent()}) || ${post.getId()}::BIGINT, ${thread.getId()})`;
      } 

      const params = [];
      const answer = await query(sqlQuery, params);
    return new Thread({author, created, forum, message, slug, title});
  }

/*
  async findThreadBySlug(slug) {
    const sqlQuery = `SELECT t.id, t.author, t.forum,
    t.slug, t.created, t.message, t.title, t.votes
    FROM threads t
    WHERE lower(t.slug) = lower($1)`;

    const answer = await query(sqlQuery, [slug]);
    if (answer.rowCount != 0) {
      return new Thread(answer.rows[0]);
    }
    else {
      return undefined;
    }
  }

  async findThreadById(id) {
    const sqlQuery = `SELECT t.id, t.slug, t.author, t.created, 
    t.forum, t.message, t.title, t.votes
    FROM threads t
    WHERE t.id = $1`;

    const answer = await query(sqlQuery, [id]);
    if (answer.rowCount != 0) {
      return new Thread(answer.rows[0]);
    }
    else {
      return undefined;
    }
  }
  */
}