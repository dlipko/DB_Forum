const Vote = require('../models/vote');
const query = require('../db/query');
const threadController = require('./thread');

class VoteController {
  constructor() {}

  async createVote(nickname, threadIdOrSlug, voise) {
      let sqlQuery = `INSERT 
      INTO votes (nickname, thread, voice) 
      VALUES ('${nickname}', `;

    const test = /^[0-9]*$/i.test(threadIdOrSlug);
    if (test) {
        threadIdOrSlug = parseInt(threadIdOrSlug, 10);
        sqlQuery += ` ${threadIdOrSlug}`;
    } else {
        sqlQuery += ` (SELECT id FROM threads WHERE slug = '${threadIdOrSlug}') `;
    }

    sqlQuery += `, ${voise})  ON CONFLICT (nickname, thread) DO UPDATE SET voice = ${voise};`;

    const answer = await query(sqlQuery, []);

    const thread = test ? await threadController.findThreadById(threadIdOrSlug) :
  await threadController.findThreadBySlug(threadIdOrSlug);

    if (thread) {
        return thread;
      }
      else {
        return undefined;
      }
  }
}

module.exports = new VoteController();