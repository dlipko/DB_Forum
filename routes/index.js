const user = require('./user');
const forum = require('./forum');
const thread = require('./thread');
const post = require('./post');
const vote = require('./vote'); 


module.exports = function query(app) {
  app.use('/api/user', user);
  app.use('/api/forum', forum);
  app.use('/api/thread', thread);
  app.use('/api/post', post);
  app.use('api/vote', vote);
}



