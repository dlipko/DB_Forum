const user = require('./user');
const forum = require('./forum');
const thread = require('./thread');
/*
const post = require('./post');
const service = require('./service'); 
*/


module.exports = function query(app) {
  app.use('/api/user', user);
  app.use('/api/forum', forum);
  // app.use('/api/thread', thread);
  /*
  app.use('/post', post);
  app.use('service', service);
   */
}



