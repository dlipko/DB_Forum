const UserRouter = require('./user');
const ForumRouter = require('./forum');
const ThreadRouter = require('./thread');
const PostRouter = require('./post');
const ServiceRouter = require('./service');

routes = {
  '/api/user': UserRouter,
  '/api/forum': ForumRouter,
  '/api/thread': ThreadRouter,
  '/api/post': PostRouter,
  '/api/service': ServiceRouter,
}

module.exports = function setRoutes(app) {
  if(routes) {
    Object.keys(routes).forEach((url) => {
      new routes[url](url, app);  
    });
  }
}



