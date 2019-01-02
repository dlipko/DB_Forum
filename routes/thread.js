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
  console.log('slugOrId', slugOrId);
  const thread = /^[0-9]*$/i.test(slugOrId) ? await threadController.findThreadById(slugOrId) :
  await threadController.findThreadBySlug(slugOrId);

  console.log('thread', thread);
  console.log('req.body', req.body);

  try {
    const posts = await postController.createPosts(req.body, thread);
    console.log('POSTS', posts);
    return res.status(201).json(posts);
  } catch (error) {
    // const users = await userController.findUsersByNicknameOrEmail(nickname, req.body.email);
    console.log(error);
    return res.status(401).json([]);
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
    // const users = await userController.findUsersByNicknameOrEmail(nickname, req.body.email);
    console.log(error);
    return res.status(401).json([]);
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