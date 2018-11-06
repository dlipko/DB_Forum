const Router = require('express-promise-router');
const ForumController = require('../controllers/forum');
const ThreadController = require('../controllers/thread');

const Thread = require('../models/thread');

const router = new Router();
const forumController = new ForumController();
const threadController = new ThreadController();

module.exports = router;

const SLUG_REGISTERED = 23505;

router.post('/create', async (req, res) => {
  try {
    const forum = await forumController.createForum(req.body.slug, req.body.title, req.body.user);
    return res.status(201).json(forum);
  } catch (error) {
    if (error.code == SLUG_REGISTERED) {
      const forum = await forumController.findForumBySlug(req.body.slug);
      return res.status(409).json(forum);
    }
    return res.status(404).json({
      "message": "Can't find user with nickname: o.6Wk3ioHf29Bu7V"
    });
  }
})

router.post('/:forumSlug/create', async (req, res) => {
  let {
    forumSlug
  } = req.params;

  if (req.body.forum)
    forumSlug = req.body.forum;

  try {
    const thread = await threadController.createThread(
      req.body.author,
      req.body.created,
      forumSlug,
      req.body.message,
      req.body.slug,
      req.body.title);
    return res.status(201).json(thread);
  } catch (error) {
    console.log(error);
    if (error.code == 23502)  {// null value in column "forum" violates not-null constraint
    return res.status(404).json({
      "message": `Can't find thread author by nickname: ${req.body.author}`
    });
    } else {
      const thread = await threadController.findThreadBySlug(req.body.slug);
      return res.status(409).json(thread);
    }
  }
})

router.get('/:slug/details', async (req, res) => {
  const {
    slug
  } = req.params;
  const user = await forumController.findForumBySlug(slug);
  if (user) {
    return res.status(200).json(user);
  } else {
    return res.status(404).json({
      "message": `Can't find forum with slug ${slug}`
    });
  }

})

router.get('/:slug/threads', async (req, res) => {
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
    return res.status(200).json(threads);
  } else {
    return res.status(404).json({
      "message": `Can't find forum with slug ${slug}`
    });
  }

  /*
  if (user) {
    return res.status(200).json(user);
  } else {
    return res.status(404).json({
      "message": `Can't find forum with slug ${slug}`
    });


    */
})