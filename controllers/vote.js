const Vote = require('../models/vote');
const query = require('../db/query');
const threadController = require('./thread');

class VoteController {
  constructor() {}

  async createVote(nickname, threadIdOrSlug, voise) {
      let sqlQuery;
    if (/^[0-9]*$/i.test(threadIdOrSlug)) {
        threadIdOrSlug = parseInt(threadIdOrSlug, 10);
        // console.log('THREADID', threadIdOrSlug);
        sqlQuery = `INSERT INTO votes (nickname, thread, voice) VALUES ($1, $2, $3)
        ON CONFLICT (nickname, thread) DO UPDATE SET voice = $3;`;
    } else {
        sqlQuery = `INSERT INTO votes (nickname, thread, voice)
            VALUES ($1, (SELECT id FROM threads WHERE slug = $2), $3)
            ON CONFLICT (nickname, thread) DO UPDATE SET voice = $3;`;
    }

    const answer = await query(sqlQuery, [nickname, threadIdOrSlug, voise]);

    // console.log(answer);

    const thread = /^[0-9]*$/i.test(threadIdOrSlug) ? await threadController.findThreadById(threadIdOrSlug) :
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