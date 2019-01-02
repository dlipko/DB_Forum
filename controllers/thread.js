const Thread = require('../models/thread');
const query = require('../db/query');

class ThreadController {
  constructor() {}

  async createThread(author, created, forum, message, slug, title) {
      const sqlQuery = `INSERT INTO threads (author, created, forum, message, slug, title)
      VALUES ((SELECT u.nickname FROM users u WHERE lower(u.nickname) = lower($1)),
      COALESCE($2::TIMESTAMPTZ, current_timestamp),
      ( SELECT f.slug FROM forums f WHERE lower(f.slug) = lower($3) ), $4, $5, $6) RETURNING *`;
    
      const params = [author, created, forum, message, slug, title];
      const answer = await query(sqlQuery, params);


      if (answer.rowCount != 0) {
        // console.log('THREAD', new Thread(answer.rows[0]));
        return new Thread(answer.rows[0]);
      }
      else {
        return undefined;
      }
  }


  async findThreadBySlug(slug) {
    // console.log('findThreadBySlug', slug);
    const sqlQuery = `SELECT t.id, t.author, t.forum,
    t.slug, t.created, t.message, t.title, t.votes
    FROM threads t
    WHERE lower(t.slug) = lower($1)`;

    const answer = await query(sqlQuery, [slug]);
    // console.log('findThreadBySlug', answer);
    if (answer.rowCount != 0) {
      return new Thread(answer.rows[0]);
    }
    else {
      return undefined;
    }
  }

  async findThreadById(id) {
    // console.log('FINDTHREADBYID', id);
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

  async updateBySlug(slug, message, title) {
    console.log('updateBySlug');
    const sqlQuery = `UPDATE threads
    SET "message" = $1,
    title = $2
    WHERE lower(slug) = lower($3)
    RETURNING *;`;
    console.log('updateBySlug',  [message, title, slug]);
    const answer = await query(sqlQuery, [message, title, slug]);
    console.log(answer);
    if (answer.rowCount != 0) {
      return new Thread(answer.rows[0]);
    }
    else {
      return undefined;
    }

  }
}

module.exports = new ThreadController();
