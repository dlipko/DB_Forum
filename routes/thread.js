const Router = require('express-promise-router');
const threadController = require('../controllers/thread');
const postController = require('../controllers/post');
const voteController = require('../controllers/vote');

const router = new Router();

module.exports = router;

const EMAIL_REGISTERED = 23505;

router.post('/:slugOrId/create', async (req, res) => {
  const {
    slugOrId
  } = req.params;
  const thread = /^[0-9]*$/i.test(slugOrId) ? await threadController.findThreadById(slugOrId) :
  await threadController.findThreadBySlug(slugOrId);

  if (!thread) {
    return res.status(404).json({
      message: `Can't find post thread by id: ${slugOrId}`,
    });
  }

  if (!req.body.length) {
    return res.status(201).json([]);
  }

  try {
    const posts = await postController.createPosts(req.body, thread);
    if (posts.length) {
    return res.status(201).json(posts);
    } else {
      return res.status(404).json({
        message: `Can't find post thread by id: ${slugOrId}`,
    });
    }
  } catch (error) {
    console.log(error);
    console.log('ERROR CODE', error.code);
    if (error.code === '23502') {
      return res.status(404).json({
        message: `Can't find post author by nickname:`,
    });
    }
    return res.status(409).json({
        message: `Can't find post author by nickname:`,
    });
  }
})


router.post('/:slugOrId/vote', async (req, res) => {
  const {
    slugOrId
  } = req.params;


  try {
    const vote = await voteController.createVote(req.body.nickname, slugOrId, req.body.voice);
    return res.status(200).json(vote);
  } catch (error) {
    console.log(slugOrId);
    console.log('/:slugOrId/vote', error);
    return res.status(404).json({
      message: `Can't find user by nickname: ${slugOrId} ${req.body.nickname}`,
    });
  }
})


router.get('/:slugOrId/details', async (req, res) => {
  const {
    slugOrId
  } = req.params;

  try {
    const thread = /^[0-9]*$/i.test(slugOrId) ? await threadController.findThreadById(slugOrId) :
    await threadController.findThreadBySlug(slugOrId);
    if (thread) {
      return res.status(200).json(thread);
    } else {
      return res.status(404).json({
        message: `Can't find thread by slug: ${slugOrId}`,
      });
    }
    } catch (error) {
      // console.log('details get', error);
      return res.status(100500).json([]);
    }

})



router.post('/:slugOrId/details', async (req, res) => {
  const {
    slugOrId
  } = req.params;

  if (req.body.message || req.body.title) {
    try {
        const thread = /^[0-9]*$/i.test(slugOrId) ? await threadController.updateById(slugOrId, req.body.message, req.body.title) :
          await threadController.updateBySlug(slugOrId, req.body.message, req.body.title);
          if (thread) {
            return res.status(200).json(thread);
          } else {
            return res.status(404).json({
              message: `Can't find thread by slug: ${slugOrId}`,
            });
          }
      } catch (error) {
        return res.status(404).json({
        message: `Can't find thread by slug: ${slugOrId}`,
      });
    }
  } else {
    try {
      const thread = /^[0-9]*$/i.test(slugOrId) ? await threadController.findThreadById(slugOrId) :
        await threadController.findThreadBySlug(slugOrId);
      if (thread) {
        return res.status(200).json(thread);
      } else {
        return res.status(404).json({
          message: `Can't find thread by slug: ${slugOrId}`,
        })
      }
    } catch {
      return res.status(404).json({
        message: `Can't find thread by slug: ${slugOrId}`,
      })
    }
  }
})

router.get('/:slugOrId/posts', async (req, res) => {
  const {
    slugOrId
  } = req.params;

  const {
    limit,
    since,
    desc,
    sort,
  } = req.query;

  let threadId = slugOrId;

  try {
    if (!/^[0-9]*$/i.test(slugOrId)) {
      const thread = await threadController.findThreadBySlug(slugOrId);
      threadId = thread.id;
    }

    let posts;
    switch (sort) {
      case 'flat': 
        posts = await postController.flatSort({threadId, limit, since, desc});
        break;
      case 'tree':
        posts = await postController.treeSort({threadId, limit, since, desc});
        break;
      case 'parent_tree':
        posts = await postController.parentTreeSort({threadId, limit, since, desc});
        break;
      default:
        posts = await postController.flatSort({threadId, limit, since, desc});
        break;
    }

    if (posts) {
      return res.status(200).json(posts.posts);
    } else {
      return res.status(200).json([]);
    }

  } catch (error) {
    console.log(error);
    return res.status(404).json([]);
  }
})