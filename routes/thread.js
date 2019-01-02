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

  console.log('slugOrId', slugOrId, thread);
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
    return res.status(404).json({
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
    return res.status(404).json({
      message: `Can't find user by nickname: ${req.body.nickname}`,
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



/*
router.get('/:nickname/profile', async (req, res) => {
  const {
    nickname
  } = req.params;

    const thread = await userController.findUserByNickname(nickname);
    if (thread) {
      return res.status(200).json(thread);
    }
    else {
      return res.status(404).json({
        "message": `Can't find thread with nickname: ${nickname} #42\n`
      });
    }
})

router.post('/:nickname/profile', async (req, res) => {
  const {
    nickname
  } = req.params;

    try {
      const thread = await userController.updateUser(nickname, req.body.fullname, req.body.email, req.body.about);
      return res.status(200).json(thread);
    }
    catch (error) {
      if (error.code == EMAIL_REGISTERED) {
        return res.status(409).json({
          "message": `This email is already registered`
        });
      }
      return res.status(404).json({
        "message": `Can't find thread with nickname: ${nickname}`
      });
    }
})
*/