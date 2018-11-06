'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _thread = require('../models/thread');

var _thread2 = _interopRequireDefault(_thread);

var _query = require('../db/query');

var _query2 = _interopRequireDefault(_query);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ThreadController = function () {
  function ThreadController() {
    _classCallCheck(this, ThreadController);
  }

  _createClass(ThreadController, [{
    key: 'createThread',
    value: async function createThread(author, created, forum, message, slug, title) {
      var sqlQuery = 'INSERT INTO threads (author, created, forum, message, slug, title)\n      VALUES ((SELECT u.nickname FROM users u WHERE lower(u.nickname) = lower($1)),\n      COALESCE($2::TIMESTAMPTZ, current_timestamp),\n      ( SELECT f.slug FROM forums f WHERE lower(f.slug) = lower($3) ), $4, $5, $6) RETURNING *';

      var params = [author, created, forum, message, slug, title];
      var answer = await (0, _query2.default)(sqlQuery, params);
      return new _thread2.default({ author: author, created: created, forum: forum, message: message, slug: slug, title: title });
    }
  }, {
    key: 'findThreadBySlug',
    value: async function findThreadBySlug(slug) {
      var sqlQuery = 'SELECT t.id, t.author, t.forum,\n    t.slug, t.created, t.message, t.title, t.votes\n    FROM threads t\n    WHERE lower(t.slug) = lower($1)';

      var answer = await (0, _query2.default)(sqlQuery, [slug]);
      if (answer.rowCount != 0) {
        return new _thread2.default(answer.rows[0]);
      } else {
        return undefined;
      }
    }
  }, {
    key: 'findThreadById',
    value: async function findThreadById(id) {
      var sqlQuery = 'SELECT t.id, t.slug, t.author, t.created, \n    t.forum, t.message, t.title, t.votes\n    FROM threads t\n    WHERE t.id = $1';

      var answer = await (0, _query2.default)(sqlQuery, [id]);
      if (answer.rowCount != 0) {
        return new _thread2.default(answer.rows[0]);
      } else {
        return undefined;
      }
    }
  }]);

  return ThreadController;
}();

exports.default = ThreadController;