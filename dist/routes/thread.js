'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _expressPromiseRouter = require('express-promise-router');

var _expressPromiseRouter2 = _interopRequireDefault(_expressPromiseRouter);

var _thread = require('../controllers/thread');

var _thread2 = _interopRequireDefault(_thread);

var _forum = require('../controllers/forum');

var _forum2 = _interopRequireDefault(_forum);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _expressPromiseRouter2.default();
var threadController = new _thread2.default();
var forumController = new _forum2.default();

exports.default = router;


var EMAIL_REGISTERED = 23505;

router.post('/:slugOrId/create', async function (req, res) {
  var slugOrId = req.params.slugOrId;
  /*
    const thread = /\\d+/i.test(slugOrId) ? threadController.findThreadById(slugOrId) :
    threadController.findThreadBySlug(slugOrId);
    const forum = forumController.findForumByThread(thread);
    try {
      const thread = await threadController.createPosts(req.body.posts, thread, forum);
      return res.status(201).json(thread);
    } catch (error) {
        console.log(error);
      
      const users = await userController.findUsersByNicknameOrEmail(nickname, req.body.email);
    }
      */

  return res.status(409);
});

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