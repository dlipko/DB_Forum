const Router = require('express-promise-router');
const voteController = require('../controllers/vote');

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();

module.exports = router;
// export our router to be mounted by the parent application

// router.post('/:nickname/create', async (req, res) => {
//   const {
//     nickname
//   } = req.params;

//   try {
//     const user = await userController.createUser(nickname, req.body.fullname, req.body.email, req.body.about);
//     return res.status(201).json(user);
//   } catch (error) {
//     const users = await userController.findUsersByNicknameOrEmail(nickname, req.body.email);
//     return res.status(409).json(users);
//   }
// })
