const Router = require('express-promise-router');
const UserController = require('../controllers/user');

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();
const userController = new UserController();

module.exports =  router;
// export our router to be mounted by the parent application

const EMAIL_REGISTERED = 23505;

router.post('/:nickname/create', async (req, res) => {
  const {
    nickname
  } = req.params;

  try {
    const user = await userController.createUser(nickname, req.body.fullname, req.body.email, req.body.about);
    return res.status(201).json(user);
  } catch (error) {
    const users = await userController.findUsersByNicknameOrEmail(nickname, req.body.email);
    return res.status(409).json(users);
  }
})

router.get('/:nickname/profile', async (req, res) => {
  const {
    nickname
  } = req.params;

    const user = await userController.findUserByNickname(nickname);
    if (user) {
      return res.status(200).json(user);
    }
    else {
      return res.status(404).json({
        "message": `Can't find user with nickname: ${nickname} #42\n`
      });
    }
})

router.post('/:nickname/profile', async (req, res) => {
  const {
    nickname
  } = req.params;

    try {
      const user = await userController.updateUser(nickname, req.body.fullname, req.body.email, req.body.about);
      return res.status(200).json(user);
    }
    catch (error) {
      if (error.code == EMAIL_REGISTERED) {
        return res.status(409).json({
          "message": `This email is already registered`
        });
      }
      return res.status(404).json({
        "message": `Can't find user with nickname: ${nickname}`
      });
    }
})
