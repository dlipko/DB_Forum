const userController = require('../controllers/user');

const EMAIL_REGISTERED = 23505;

class UserRouter {
  constructor(url, app) {
    app.post(`${url}/:nickname/create`, createUser);
    app.get(`${url}/:nickname/profile`, getProfile);
    app.post(`${url}/:nickname/profile`, editProfile);
  }
}

async function createUser(req, res) {
  const {
    nickname
  } = req.params;

  try {
    const user = await userController.createUser(nickname, req.body.fullname, req.body.email, req.body.about);
    return res.status(201).send(user);
  } catch (error) {
    const users = await userController.findUsersByNicknameOrEmail(nickname, req.body.email);
    return res.status(409).send(users);
  }
};

async function getProfile(req, res) {
  const {
    nickname
  } = req.params;

  const user = await userController.findUserByNickname(nickname);
  if (user) {
    return res.status(200).send(user);
  } else {
    return res.status(404).send({
      "message": `Can't find user with nickname: ${nickname} #42\n`
    });
  }
};

async function editProfile(req, res) {
  const {
    nickname
  } = req.params;

  try {
    const user = await userController.updateUser(nickname, req.body.fullname, req.body.email, req.body.about);
    return res.status(200).send(user);
  } catch (error) {
    if (error.code == EMAIL_REGISTERED) {
      return res.status(409).send({
        "message": `This email is already registered`
      });
    }
    return res.status(404).send({
      "message": `Can't find user with nickname: ${nickname}`
    });
  }
};

module.exports = UserRouter;