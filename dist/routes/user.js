'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _expressPromiseRouter = require('express-promise-router');

var _expressPromiseRouter2 = _interopRequireDefault(_expressPromiseRouter);

var _user = require('../controllers/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
var router = new _expressPromiseRouter2.default();
var userController = new _user2.default();

exports.default = router;
// export our router to be mounted by the parent application

var EMAIL_REGISTERED = 23505;

router.post('/:nickname/create', async function (req, res) {
  var nickname = req.params.nickname;


  try {
    var user = await userController.createUser(nickname, req.body.fullname, req.body.email, req.body.about);
    return res.status(201).json(user);
  } catch (error) {
    var users = await userController.findUsersByNicknameOrEmail(nickname, req.body.email);
    return res.status(409).json(users);
  }
});

router.get('/:nickname/profile', async function (req, res) {
  var nickname = req.params.nickname;


  var user = await userController.findUserByNickname(nickname);
  if (user) {
    return res.status(200).json(user);
  } else {
    return res.status(404).json({
      "message": 'Can\'t find user with nickname: ' + nickname + ' #42\n'
    });
  }
});

router.post('/:nickname/profile', async function (req, res) {
  var nickname = req.params.nickname;


  try {
    var user = await userController.updateUser(nickname, req.body.fullname, req.body.email, req.body.about);
    return res.status(200).json(user);
  } catch (error) {
    if (error.code == EMAIL_REGISTERED) {
      return res.status(409).json({
        "message": 'This email is already registered'
      });
    }
    return res.status(404).json({
      "message": 'Can\'t find user with nickname: ' + nickname
    });
  }
});