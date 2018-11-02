'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _post = require('../models/post');

var _post2 = _interopRequireDefault(_post);

var _query = require('../db/query');

var _query2 = _interopRequireDefault(_query);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PostController = function () {
  function PostController() {
    _classCallCheck(this, PostController);
  }

  _createClass(PostController, [{
    key: 'createPosts',
    value: async function createPosts(posts, thread, forum) {
      var created = new Date().toISOString();
      var sqlQuery = 'INSERT INTO posts \n    (author, created, forum, is_edited, message, parent, path, thread_id)\n    VALUES ';
      for (var post in posts) {
        sqlQuery += '((SELECT u.nickname FROM users u WHERE lower(u.nickname) = lower(\'' + post.author + '\')), ' + created + '::TIMESTAMPTZ,\n        (SELECT f.slug FROM forums f WHERE lower(f.slug) = lower(\'' + forum.getSlug() + '\')), 1, \'' + post.message + '\', 42, \n        (SELECT id FROM posts WHERE id = ' + post.getParent() + ') || ' + post.getId() + '::BIGINT, ' + thread.getId() + ')';
      }

      var params = [];
      var answer = await (0, _query2.default)(sqlQuery, params);
      return new Thread({ author: author, created: created, forum: forum, message: message, slug: slug, title: title });
    }

    /*
      async findThreadBySlug(slug) {
        const sqlQuery = `SELECT t.id, t.author, t.forum,
        t.slug, t.created, t.message, t.title, t.votes
        FROM threads t
        WHERE lower(t.slug) = lower($1)`;
    
        const answer = await query(sqlQuery, [slug]);
        if (answer.rowCount != 0) {
          return new Thread(answer.rows[0]);
        }
        else {
          return undefined;
        }
      }
    
      async findThreadById(id) {
        const sqlQuery = `SELECT t.id, t.slug, t.author, t.created, 
        t.forum, t.message, t.title, t.votes
        FROM threads t
        WHERE t.id = $1`;
    
        const answer = await query(sqlQuery, [id]);
        if (answer.rowCount != 0) {
          return new Thread(answer.rows[0]);
        }
        else {
          return undefined;
        }
      }
      */

  }]);

  return PostController;
}();

exports.default = PostController;