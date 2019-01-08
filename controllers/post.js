const Posts = require('../models/posts');
const Post = require('../models/post');
const query = require('../db/query');

class PostController {
  constructor() {}

  async createPosts(posts, thread) {
    if (this.getStatus() == 1500000) {
      await query("CLUSTER posts using index_posts_root_and_path; CLUSTER foeumusers usinfg forumusers_pimaty_key;");
    }
    if (posts.length) { 
    const created = new Date().toISOString();
    let sqlQuery = `INSERT INTO posts 
    (author, forum, is_edited, message, parent, thread)
    VALUES `;
      posts.forEach((post) => {
        let parent;
        if (!post.parent) {
          post.parent = 0;
        }
        sqlQuery += `((SELECT nickname FROM users WHERE nickname = '${post.author}'),
        (SELECT slug FROM forums WHERE slug = '${thread.getForum()}'), FALSE, '${post.message}', 
        ${post.parent}, ${thread.getId()}),`;
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

  async flatSort({threadId, limit, since, desc}) {
    let sqlQuery = `SELECT id, author, created, forum, is_edited, message, thread, parent
    FROM posts
    WHERE thread = ${threadId} `;

    if (since) {
      if (desc === 'true') {
        sqlQuery += ` AND id < ${since} `;
      } else {
        sqlQuery += ` AND id > ${since} `;
      }
    }

    if (desc === 'true') {
      sqlQuery += ` ORDER BY id DESC `;
    } else {
      sqlQuery += ` ORDER BY id ASC `;
    }

    if (limit) {
      sqlQuery += ` LIMIT ${limit}`;
    }

    sqlQuery += `;`;

    const answer = await query(sqlQuery, []);
    if (answer.rowCount != 0) {
      return new Posts(answer.rows);
    }
    else {
      return undefined;
    }
  }

  async treeSort({threadId, limit, since, desc}) {
    let sqlQuery = `SELECT id, author, created, forum, is_edited, message, thread, parent
    FROM posts
    WHERE thread = ${threadId} `;

    if (since) {
      sqlQuery += ` AND path `;
			if (desc === 'true') {
				sqlQuery += ` < `;
			} else {
				sqlQuery += ` > `;
      }
      sqlQuery += ` (SELECT path FROM posts WHERE id = ${since}) `;
    }

    sqlQuery += ` ORDER BY path `; 
    
    if (desc === 'true') {
			sqlQuery += ` DESC `;
		}

    if (limit) {
      sqlQuery += ` LIMIT ${limit}`;
    }

    sqlQuery += `;`;

    const answer = await query(sqlQuery, []);
    if (answer.rowCount != 0) {
      return new Posts(answer.rows);
    }
    else {
      return undefined;
    }
  }

  async parentTreeSort({threadId, limit, since, desc}) {
    let sqlQuery = `SELECT id, author, created, forum, is_edited, message, thread, parent
    FROM posts
    WHERE root IN (SELECT id FROM posts WHERE thread = ${threadId} AND parent = 0`;

    if (since) {
      sqlQuery += ` AND id `;
			if (desc === 'true') {
				sqlQuery += ` < `;
			} else {
				sqlQuery += ` > `;
      }
      sqlQuery += ` (SELECT root FROM posts WHERE id = ${since}) `;
    }
    
    sqlQuery += ` ORDER BY id `;

		if (desc === 'true') {
			sqlQuery += ` DESC `;
    }
    
    if (limit) {
      sqlQuery += ` LIMIT ${limit}) `;
    }
	
		if (desc === 'true') {
			sqlQuery += ` ORDER BY root DESC, path `;
		} else {
			sqlQuery += ` ORDER BY path `;
		}

    sqlQuery += `;`;

    const answer = await query(sqlQuery, []);
    if (answer.rowCount != 0) {
      return new Posts(answer.rows);
    }
    else {
      return undefined;
    }
  }

  async findPostById(id) {
    const sqlQuery = `SELECT id, author, created, forum, is_edited, message, thread, parent
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

  async getUsers({ slug, limit, since, desc }) {
    let sqlQuery = `
    SELECT *
    FROM users
    WHERE (nickname IN (SELECT nickname FROM forumusers WHERE slug = $1) 
    OR nickname IN (SELECT author FROM threads WHERE forum = $1))`;
    
    if (since) {
			if (desc === 'true') {
				sqlQuery += ` AND nickname < '${since}'`;
			} else {
				sqlQuery += ` AND nickname > '${since}'`;
			}
    }

    sqlQuery += ` ORDER BY nickname `;

		if (desc === 'true') {
			sqlQuery += ` DESC `;
    }
    
    if (limit) {
      sqlQuery += ` LIMIT  ${limit} `;
    }

    sqlQuery += `;`;


    const answer = await query(sqlQuery, [slug]);
    if (answer.rowCount != 0) {
      return answer.rows;
    }
    else {
      return undefined;
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