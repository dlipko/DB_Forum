const forumController = require('../controllers/forum');
const threadController = require('../controllers/thread');
const postController = require('../controllers/post');

const Thread = require('../models/thread');


class ForumRouter {
  constructor(url, app) {
    app.post(`${url}/create`, createForum);
    app.post(`${url}/:forumSlug/create`, createThread);
    app.get(`${url}/:slug/details`, forumDetails);
    app.get(`${url}/:slug/threads`, getThreads);
    app.get(`${url}/:slug/users`, getUsers);
  }
}

const SLUG_REGISTERED = 23505;

async function createForum(req, res) {
  try {
    const forum = await forumController.createForum(req.body.slug, req.body.title, req.body.user);
    return res.status(201).send(forum);
  } catch (error) {
    if (error.code == SLUG_REGISTERED) {
      const forum = await forumController.findForumBySlug(req.body.slug);
      return res.status(409).send(forum);
    }
    return res.status(404).send({
      "message": "Can't find user with nickname: o.6Wk3ioHf29Bu7V"
    });
  }
};

async function createThread(req, res) {
  let {
    forumSlug
  } = req.params;
  
  if (req.body.forum)
  forumSlug = req.body.forum;
  
  
  // console.log('/:forumSlug/create', forumSlug);
  try {
    const thread = await threadController.createThread(
      req.body.author,
      req.body.created,
      forumSlug,
      req.body.message,
      req.body.slug,
      req.body.title);
      // console.log('THREAD CREATETHREAD', thread);
      return res.status(201).send(thread);
    } catch (error) {
      // console.log(error);
      if (error.code == 23502) { // null value in column "forum" violates not-null constraint
      return res.status(404).send({
        "message": `Can't find thread author by nickname: ${req.body.author}`
      });
    } else {
      const thread = await threadController.findThreadBySlug(req.body.slug);
      return res.status(409).send(thread);
    }
  }
};

async function forumDetails(req, res) {
  const {
    slug
  } = req.params;
  const forum = await forumController.findForumBySlug(slug);
  if (forum) {
    return res.status(200).send(forum);
  } else {
    return res.status(404).send({
      "message": `Can't find forum with slug ${slug}`
    });
  }
};

async function getThreads(req, res) {
  const {
    slug
  } = req.params;
  
  const {
    limit,
    since,
    desc
  } = req.query;
  
  
  const forum = await forumController.findForumBySlug(slug);
  if (forum) {
    const threads = await forumController.getForumThreads(slug, limit, since, desc);
    return res.status(200).send(threads);
  } else {
    return res.status(404).send({
      "message": `Can't find forum with slug ${slug}`
    });
  }
};

async function getUsers(req, res) {
  try {
  const {
    slug
  } = req.params;
  
  const {
    limit,
    since,
    desc,
  } = req.query;

    const forumIsExist = await forumController.isExist(slug);
    if (!forumIsExist) {
      return res.status(404).send({
        "message": "Can't find forum by slug: 03I9V4x1eoKo8"
      });
    }
    
    users = await postController.getUsers({
      slug,
      limit,
      since,
      desc
    });
    
    if (users) {
      return res.status(200).send(users);
    } else {
      return res.status(200).send([]);
    }
    
  } catch (error) {
    // console.log(error);
    return res.status(404).send({
      "message": "Can't find forum by slug: 03I9V4x1eoKo8"
    });
  }
};

module.exports = ForumRouter;
