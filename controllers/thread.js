const Thread = require('../models/thread');
const query = require('../db/query');

class ThreadController {
  constructor() {}

  async createThread(author, created, forum, message, slug, title) {
      let sqlQuery = `
      INSERT
      INTO threads (author, forum, created, message, slug, title) 
      VALUES ((SELECT nickname FROM users WHERE nickname = '${author}'),
      (SELECT slug FROM forums WHERE slug = '${forum}'), `;
      if (created) {
        sqlQuery += ` '${created}'::TIMESTAMPTZ, `;
      } else {
        sqlQuery += `current_timestamp, `;
      }
      sqlQuery += `
        '${message}',
        $1,
        '${title}') 
        RETURNING *`;

      const answer = await query(sqlQuery, [slug]);


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
    const sqlQuery = `SELECT *
    FROM threads
    WHERE slug = $1`;

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
    const sqlQuery = `SELECT *
    FROM threads
    WHERE id = ${id}`;

    const answer = await query(sqlQuery, []);
    if (answer.rowCount != 0) {
      return new Thread(answer.rows[0]);
    }
    else {
      return undefined;
    }
  } 

  async updateBySlug(slug, message, title) {
    let sqlQuery = `UPDATE threads
    SET `;
    let params = [];
    if (message) {
      if (title) {
        sqlQuery += `"message" = $1, title = $2 WHERE slug = $3 RETURNING *;`;
        params = [message, title, slug];
      } else {
        sqlQuery += `"message" = $1 WHERE slug = $2 RETURNING *;`;
        params = [message, slug];
      }
    } else {
      if (title) {
        sqlQuery += `title = $1 WHERE slug = $2 RETURNING *;`;
        params = [title, slug];
      } else {
        return undefined;
      }
    }

    const answer = await query(sqlQuery, params);
    if (answer.rowCount != 0) {
      return new Thread(answer.rows[0]);
    }
    else {
      return undefined;
    }
  }

  async updateById(id, message, title) {
    let sqlQuery = `UPDATE threads
    SET `;
    let params = [];
    if (message) {
      if (title) {
        sqlQuery += `"message" = $1, title = $2 WHERE id = $3 RETURNING *;`;
        params = [message, title, id];
      } else {
        sqlQuery += `"message" = $1 WHERE id = $2 RETURNING *;`;
        params = [message, id];
      }
    } else {
      if (title) {
        sqlQuery += `title = $1 WHERE id = $2 RETURNING *;`;
        params = [title, id];
      } else {
        return undefined;
      }
    }

    const answer = await query(sqlQuery, params);
    if (answer.rowCount != 0) {
      return new Thread(answer.rows[0]);
    }
    else {
      return undefined;
    }
  }

  async getStatus() {
    const sqlQuery = `SELECT COUNT(*) count
    FROM threads;`
    const answer = await query(sqlQuery, []);
    return parseInt(answer.rows[0].count, 10);
  }

  async clear() {
    const sqlQuery = `TRUNCATE TABLE threads CASCADE;`
    await query(sqlQuery, []);
  }
}

module.exports = new ThreadController();
