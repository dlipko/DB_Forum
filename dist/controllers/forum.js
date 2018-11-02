'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _forum = require('../models/forum');

var _forum2 = _interopRequireDefault(_forum);

var _thread = require('../models/thread');

var _thread2 = _interopRequireDefault(_thread);

var _query = require('../db/query');

var _query2 = _interopRequireDefault(_query);

var _user = require('../controllers/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var userController = new _user2.default();

var ForumController = function () {
  function ForumController() {
    _classCallCheck(this, ForumController);
  }

  _createClass(ForumController, [{
    key: 'createForum',
    value: async function createForum(slug, title, user) {
      user = await userController.getUserNicknameByNickname(user);
      var sqlQuery = 'INSERT INTO forums (slug, title, "user")\n      VALUES ($1, $2, (SELECT nickname FROM users WHERE lower(nickname) = lower($3)))';
      var answer = await (0, _query2.default)(sqlQuery, [slug, title, user]);
      console.log('forum insert', answer);
      return new _forum2.default({
        slug: slug,
        title: title,
        user: user
      });
    }
  }, {
    key: 'findForumBySlug',
    value: async function findForumBySlug(slug) {
      var sqlQuery = 'SELECT f.id, f.title, f."user", f.slug, f.posts, f.threads\n    FROM forums f\n    WHERE lower(f.slug) = lower($1)';

      var answer = await (0, _query2.default)(sqlQuery, [slug]);
      if (answer.rowCount != 0) {
        return new _forum2.default(answer.rows[0]);
      } else {
        return undefined;
      }
    }
  }, {
    key: 'getForumThreads',
    value: async function getForumThreads(slug, limit, since, desc) {
      var sqlQuery = 'SELECT t.id, t.slug, t.author,\n    t.forum, t.created, t.message, t.title\n    FROM threads t\n    WHERE lower(t.forum) = lower($1) ';

      if (since) {
        if (desc == 'true') {
          sqlQuery += ' AND t.created <= \'' + since + '\'::TIMESTAMPTZ ORDER BY t.created DESC ';
        } else {
          sqlQuery += ' AND t.created >= \'' + since + '\'::TIMESTAMPTZ ORDER BY t.created ASC ';
        }
      } else {
        sqlQuery += ' ORDER BY t.created ';
        if (desc == 'true') {
          sqlQuery += ' DESC ';
        } else {
          sqlQuery += ' ASC ';
        }
      }

      sqlQuery += 'LIMIT $2';

      var answer = await (0, _query2.default)(sqlQuery, [slug, limit]);

      console.log(answer);
      var newThreads = answer.rows.map(function (thread) {
        return new _thread2.default(thread);
      });
      return newThreads;
    }
  }]);

  return ForumController;
}();

exports.default = ForumController;