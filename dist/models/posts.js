"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Post = function () {
    function Post(_ref) {
        var author = _ref.author,
            created = _ref.created,
            forum = _ref.forum,
            message = _ref.message,
            thread = _ref.thread,
            parent = _ref.parent,
            isEdited = _ref.isEdited;

        _classCallCheck(this, Post);

        this.author = author;
        this.created = created;
        this.forum = forum;
        this.message = message;
        this.thread = thread;
        this.parent = parent;
        this.isEdited = isEdited;
    }

    _createClass(Post, [{
        key: "setAuthor",
        value: function setAuthor(author) {
            this.author = author;
        }
    }, {
        key: "setForum",
        value: function setForum(forum) {
            this.forum = forum;
        }
    }, {
        key: "setThread",
        value: function setThread(thread) {
            this.thread = thread;
        }
    }, {
        key: "getId",
        value: function getId() {

            return id;
        }
    }, {
        key: "getAuthor",
        value: function getAuthor() {
            return author;
        }
    }, {
        key: "getCreated",
        value: function getCreated() {
            return created;
        }
    }, {
        key: "getForum",
        value: function getForum() {
            return forum;
        }
    }, {
        key: "getMessage",
        value: function getMessage() {
            return message;
        }
    }, {
        key: "getThread",
        value: function getThread() {
            return thread;
        }
    }, {
        key: "getParent",
        value: function getParent() {
            return parent;
        }
    }, {
        key: "getIsEdited",
        value: function getIsEdited() {
            return isEdited;
        }
    }, {
        key: "setCreated",
        value: function setCreated(created) {
            this.created = created;
        }
    }, {
        key: "setMessage",
        value: function setMessage(message) {
            this.message = message;
        }
    }, {
        key: "setEdited",
        value: function setEdited(edited) {
            isEdited = edited;
        }
    }]);

    return Post;
}();

exports.default = Post;