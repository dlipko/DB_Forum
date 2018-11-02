import Thread from '../models/thread';
import query from '../db/query';

export default class ThreadController {
  constructor() {}

  async createThread(author, created, forum, message, slug, title) {
      const sqlQuery = `INSERT INTO threads (author, created, forum, message, slug, title)
      VALUES ((SELECT u.nickname FROM users u WHERE lower(u.nickname) = lower($1)),
      COALESCE($2::TIMESTAMPTZ, current_timestamp),
      ( SELECT f.slug FROM forums f WHERE lower(f.slug) = lower($3) ), $4, $5, $6) RETURNING *`;
    
      const params = [author, created, forum, message, slug, title];
      const answer = await query(sqlQuery, params);
    return new Thread({author, created, forum, message, slug, title});
  }


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
  
}