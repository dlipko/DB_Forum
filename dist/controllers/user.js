'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _query = require('../db/query');

var _query2 = _interopRequireDefault(_query);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserController = function () {
  function UserController() {
    _classCallCheck(this, UserController);
  }

  _createClass(UserController, [{
    key: 'createUser',
    value: async function createUser(nickname, fullname, email, about) {
      var answer = await (0, _query2.default)('INSERT INTO users (nickname, fullname, email, about) VALUES ($1, $2, $3, $4)', [nickname, fullname, email, about]);
      return new _user2.default({ nickname: nickname, fullname: fullname, email: email, about: about });
    }
  }, {
    key: 'findUsersByNicknameOrEmail',
    value: async function findUsersByNicknameOrEmail(nickname, email) {
      var answer = await (0, _query2.default)('SELECT * FROM users AS u WHERE lower($1) = lower(u.nickname) OR lower($2) = lower(u.email)', [nickname, email]);
      var newUsers = answer.rows.map(function (user) {
        return new _user2.default(user);
      });
      return newUsers;
    }
  }, {
    key: 'findUserByNickname',
    value: async function findUserByNickname(nickname) {
      var answer = await (0, _query2.default)('SELECT * FROM users AS u WHERE lower($1) = lower(u.nickname)', [nickname]);
      if (answer.rowCount != 0) {
        return new _user2.default(answer.rows[0]);
      } else {
        return undefined;
      }
    }
  }, {
    key: 'updateUser',
    value: async function updateUser(nickname, fullname, email, about) {
      var sqlQuery = 'UPDATE users SET fullname = COALESCE($1, fullname),\n    email = COALESCE($2, email),\n    about = COALESCE($3, about)\n    WHERE lower($4) = lower(nickname)\n    RETURNING *';
      var answer = await (0, _query2.default)(sqlQuery, [fullname, email, about, nickname]);
      // console.log(answer);
      return new _user2.default(answer.rows[0]);
    }
  }, {
    key: 'getUserNicknameByNickname',
    value: async function getUserNicknameByNickname(nickname) {
      var sqlQuery = 'SELECT u.nickname FROM users u WHERE lower(nickname) = lower($1)';
      var answer = await (0, _query2.default)(sqlQuery, [nickname]);
      return answer.rows[0].nickname;
    }
  }]);

  return UserController;
}();

exports.default = UserController;