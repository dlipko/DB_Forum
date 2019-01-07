const Forum = require('../models/forum');
const Thread = require('../models/thread');
const query = require('../db/query');
const userController = require('../controllers/user');

class ForumController {
  constructor() {}

  async createForum(slug, title, user) {
    user = await userController.getUserNicknameByNickname(user);
    const sqlQuery = `INSERT INTO forums (slug, title, \"user\")
      VALUES ($1, $2, (SELECT nickname FROM users WHERE nickname = $3))`;
    const answer = await query(sqlQuery, [slug, title, user]);
    return new Forum({
      slug,
      title,
      user
    });
  }

  async findForumBySlug(slug) {
    const sqlQuery = `SELECT *
    FROM forums f
    WHERE f.slug = $1`;

    const answer = await query(sqlQuery, [slug]);
    if (answer.rowCount != 0) {
      return new Forum(answer.rows[0]);
    } else {
      return undefined;
    }
  }

  async isExist(slug) {
    const sqlQuery = `SELECT 1
    FROM forums
    WHERE slug = $1;`
    const answer = await query(sqlQuery, [slug]);
    return answer.rowCount;
  }

  async getForumThreads(slug, limit, since, desc) {
    let sqlQuery = `SELECT t.id, t.slug, t.author,
    t.forum, t.created, t.message, t.title
    FROM threads t
    WHERE t.forum = $1 `;

    if (since) {
      if (desc == 'true') {
        sqlQuery += ` AND t.created <= '${since}'::TIMESTAMPTZ ORDER BY t.created DESC `;
      } else {
        sqlQuery += ` AND t.created >= '${since}'::TIMESTAMPTZ ORDER BY t.created ASC `;
      }
    } else {
      sqlQuery += ` ORDER BY t.created `;
      if (desc == 'true') {
        sqlQuery += ` DESC `;
      } else {
        sqlQuery += ` ASC `;
      }
    }

    sqlQuery += `LIMIT $2`;


    const answer = await query(sqlQuery, [slug, limit]);

    const newThreads = answer.rows.map(thread => new Thread(thread))
    return newThreads;
  }

  async getStatus() {
    const sqlQuery = `SELECT COUNT(*) count
    FROM forums;`
    const answer = await query(sqlQuery, []);
    return parseInt(answer.rows[0].count, 10);
  }

  async clear() {
    const sqlQuery = `TRUNCATE TABLE forums CASCADE;`
    await query(sqlQuery, []);
  }
}

module.exports = new ForumController();