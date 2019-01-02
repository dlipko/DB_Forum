const Vote = require('../models/vote');
const query = require('../db/query');
const threadController = require('./thread');

class VoteController {
  constructor() {}

  async createVote(nickname, threadSlug, voise) {
    const sqlQuery = `INSERT INTO votes (nickname, thread_id, voice)
      VALUES ($1, (SELECT id FROM threads WHERE slug = $2), $3);`;
    //   ON CONFLICT DO UPDATE SET voice = $3 WHERE votes.thread_id = (SELECT id FROM threads WHERE slug = $2) AND votes.nickname = $1;`;
    const answer = await query(sqlQuery, [nickname, threadSlug, voise]);
    console.log('PARAMS', [nickname, threadSlug, voise]);
    const thread = await threadController.findThreadBySlug(threadSlug);

    if (answer.rowCount != 0) {
        return thread;
      }
      else {
        return undefined;
      }
  }
}

module.exports = new VoteController();