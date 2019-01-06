const Posts = require('../models/posts');
const Post = require('../models/post');
const query = require('../db/query');

class PostController {
  constructor() {}

  async createPosts(posts, thread) {
    if (posts.length) { 
    const created = new Date().toISOString();
    let sqlQuery = `INSERT INTO posts 
    (author, forum, is_edited, message, parent, thread_id)
    VALUES `;
      posts.forEach((post) => {
        let parent;
        if (!post.parent) {
          post.parent = 0;
        }
        // sqlQuery += `((SELECT u.nickname FROM users u WHERE lower(u.nickname) = lower('${post.author}')),
        // (SELECT f.slug FROM forums f WHERE lower(f.slug) = lower('${thread.getForum()}')), true, '${post.message}', 
        // (SELECT id FROM posts WHERE id = ${post.parent}), ${thread.getId()});`;

        sqlQuery += `((SELECT u.nickname FROM users u WHERE lower(u.nickname) = lower('${post.author}')),
        (SELECT f.slug FROM forums f WHERE lower(f.slug) = lower('${thread.getForum()}')), FALSE, '${post.message}', 
        ${post.parent}, ${thread.getId()}),`;
      
        // const params = [post.author, created, thread.getForum(), post.message, post.parent, thread.getId()];
      });

    sqlQuery = sqlQuery.substring(0, sqlQuery.length - 1);
    sqlQuery += ' RETURNING *;';

    const answer = await query(sqlQuery);
    // // console.log(answer);
    if (answer.rowCount != 0) {
      return new Posts(answer.rows).posts;
    }
    else {
      return undefined;
    }
  }
  return [];
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
*/

  async flatSort({threadId, limit, since, desc}) {
    let sqlQuery = `SELECT *
    FROM posts
    WHERE thread_id = ${threadId} `;

    if (since) {
      sqlQuery += ` AND id > ${since} `;
    }

    if (desc) {
      sqlQuery += ` ORDER BY created DESC `;
    } else {
      sqlQuery += ` ORDER BY  id ASC `;
    }

    if (limit) {
      sqlQuery += ` LIMIT ${limit}`;
    }

    sqlQuery += `;`;
    const answer = await query(sqlQuery, []);
    console.log(answer.rows);
    if (answer.rowCount != 0) {
      return new Posts(answer.rows);
    }
    else {
      return undefined;
    }
  }

  async findPostById(id) {
    const sqlQuery = `SELECT *
    FROM posts
    WHERE id = $1`;

    const answer = await query(sqlQuery, [id]);
    if (answer.rowCount != 0) {
      return new Post(answer.rows[0]);
    }
    else {
      return undefined;
    }
  }


  async updateById(id, message) {
    const post = await this.findPostById(id); 
    // console.log(message !== post.message, message, post.message)
     if (message && post && message !== post.message) {
      const sqlQuery = `UPDATE posts
      SET "message" = $1, is_edited = TRUE WHERE id = $2 RETURNING *;`;
      const answer = await query(sqlQuery, [message, id]);;
      if (answer.rowCount != 0) {
        return new Post(answer.rows[0]);
      }
      else {
        return undefined;
      }
    } else {
      return post;
    }
  }

  async getStatus() {
    const sqlQuery = `SELECT COUNT(*) count
    FROM posts;`
    const answer = await query(sqlQuery, []);
    return parseInt(answer.rows[0].count, 10);
  }

  async clear() {
    const sqlQuery = `TRUNCATE TABLE posts CASCADE;`
    await query(sqlQuery, []);
  }
}

module.exports = new PostController();