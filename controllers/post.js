const Posts = require('../models/posts');
const query = require('../db/query');

class PostController {
  constructor() {}

  async createPosts(posts, thread) {
    if (posts.length) { 
    const created = new Date().toISOString();
    let sqlQuery = `INSERT INTO posts 
    (author, forum, is_edited, message, parent, thread_id)
    VALUES `;
    console.log('POSTS', posts);
      posts.forEach((post) => {
        console.log('POST', post);
        let parent;
        if (!post.parent) {
          post.parent = 0;
        }
        // sqlQuery += `((SELECT u.nickname FROM users u WHERE lower(u.nickname) = lower('${post.author}')),
        // (SELECT f.slug FROM forums f WHERE lower(f.slug) = lower('${thread.getForum()}')), true, '${post.message}', 
        // (SELECT id FROM posts WHERE id = ${post.parent}), ${thread.getId()});`;

        sqlQuery += `((SELECT u.nickname FROM users u WHERE lower(u.nickname) = lower('${post.author}')),
        (SELECT f.slug FROM forums f WHERE lower(f.slug) = lower('${thread.getForum()}')), true, '${post.message}', 
        ${post.parent}, ${thread.getId()})`;
      
        const params = [post.author, created, thread.getForum(), post.message, post.parent, thread.getId()];
      });

    sqlQuery += ' RETURNING *';

    const answer = await query(sqlQuery);
    console.log(answer);
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

module.exports = new PostController();