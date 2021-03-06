const User = require('../models/user');
const query = require('../db/query');

class UserController {
  constructor() {}

  async createUser(nickname, fullname, email, about) {
    const answer = await query(`
    INSERT 
    INTO users (nickname, fullname, email, about) 
    VALUES ($1, $2, $3, $4)`,
      [nickname, fullname, email, about]);
      return new User({nickname, fullname, email, about});
  }

  async findUsersByNicknameOrEmail(nickname, email) {
    const answer = await query(`
      SELECT * 
      FROM users 
      WHERE nickname = $1 OR email = $2;`, [nickname, email])
    const newUsers = answer.rows.map(user => new User(user));
    return newUsers;
  }

  async findUserByNickname(nickname) {
    const answer = await query(`
    SELECT * 
    FROM users 
    WHERE nickname = $1;`, [nickname])
    if (answer.rowCount != 0) {
      return new User(answer.rows[0]);
    }
    else {
      return undefined;
    }
  }

  async updateUser(nickname, fullname, email, about) {
    let sqlQuery = `UPDATE users SET `
    if (fullname) {
      sqlQuery += ` fullname = '${fullname}', `;
    } else {
      sqlQuery += ` fullname = fullname, `;
    }
    if (email) {
      sqlQuery += ` email = '${email}', `;
    } else {
      sqlQuery += ` email = email, `;
    }
    if (about) {
      sqlQuery += ` about = '${about}' `;
    } else {
      sqlQuery += ` about = about `;
    }
    sqlQuery += `
    WHERE nickname = '${nickname}'
    RETURNING *`; 
    const answer = await query(sqlQuery, []);
    return new User(answer.rows[0]);
  }

  async getUserNicknameByNickname(nickname) {
    const sqlQuery = `
    SELECT nickname
    FROM users 
    WHERE nickname = $1`;
    const answer = await query(sqlQuery, [nickname]);
    return answer.rows[0].nickname;
  }

  async getStatus() {
    const sqlQuery = `
    SELECT COUNT(*) count
    FROM users;`
    const answer = await query(sqlQuery, []);
    return parseInt(answer.rows[0].count, 10);
  }

  async clear() {
    const sqlQuery = `TRUNCATE TABLE users CASCADE;`
    await query(sqlQuery, []);
  }
}

module.exports = new UserController();