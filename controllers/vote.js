const Vote = require('../models/vote');
const query = require('../db/query');
const threadController = require('./thread');

class VoteController {
  constructor() {}

  async createVote(nickname, threadIdOrSlug, voise) {
      let sqlQuery;
      const parse = parseInt(threadIdOrSlug);
    if (parse) {
        threadIdOrSlug = parse;
        sqlQuery = `INSERT INTO votes (nickname, thread_id, voice) VALUES ($1, $2, $3)
        ON CONFLICT (nickname, thread_id) DO UPDATE SET voice = $3;`;
    } else {
        sqlQuery = `INSERT INTO votes (nickname, thread_id, voice)
            VALUES ($1, (SELECT id FROM threads WHERE slug = $2), $3);`;
    //   ON CONFLICT DO UPDATE SET voice = $3 WHERE votes.thread_id = (SELECT id FROM threads WHERE slug = $2) AND votes.nickname = $1;`;
    }
    
    
    const answer = await query(sqlQuery, [nickname, threadIdOrSlug, voise]);
    console.log('PARAMS', [nickname, threadIdOrSlug, voise]);
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