import Forum from '../models/forum';
import Thread from '../models/thread';
import query from '../db/query';
import UserController from '../controllers/user';

const userController = new UserController();

export default class ForumController {
  constructor() {}

  async createForum(slug, title, user) {
    user = await userController.getUserNicknameByNickname(user);
    const sqlQuery = `INSERT INTO forums (slug, title, \"user\")
      VALUES ($1, $2, (SELECT nickname FROM users WHERE lower(nickname) = lower($3)))`;
    const answer = await query(sqlQuery, [slug, title, user]);
    console.log('forum insert', answer);
    return new Forum({
      slug,
      title,
      user
    });
  }

  async findForumBySlug(slug) {
    const sqlQuery = `SELECT f.id, f.title, f."user", f.slug, f.posts, f.threads
    FROM forums f
    WHERE lower(f.slug) = lower($1)`;

    const answer = await query(sqlQuery, [slug]);
    if (answer.rowCount != 0) {
      return new Forum(answer.rows[0]);
    } else {
      return undefined;
    }
  }

  async getForumThreads(slug, limit, since, desc) {
    let sqlQuery = `SELECT t.id, t.slug, t.author,
    t.forum, t.created, t.message, t.title
    FROM threads t
    WHERE lower(t.forum) = lower($1) `

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

    console.log(answer);
    const newThreads = answer.rows.map(thread => new Thread(thread))
    return newThreads;
  }


}