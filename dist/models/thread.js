"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = function () {
    function User(_ref) {
        var author = _ref.author,
            created = _ref.created,
            forum = _ref.forum,
            message = _ref.message,
            slug = _ref.slug,
            title = _ref.title,
            votes = _ref.votes;

        _classCallCheck(this, User);

        this.author = author;
        this.created = created;
        this.forum = forum;
        this.message = message;
        if (slug != forum) {
            this.slug = slug;
        }
        this.title = title;
        if (votes && votes != 0) {
            this.votes = votes;
        }
        this.id = 42;
    }

    _createClass(User, [{
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
        key: "getTitle",
        value: function getTitle() {
            return title;
        }
    }, {
        key: "getVotes",
        value: function getVotes() {
            return votes;
        }
    }, {
        key: "getSlug",
        value: function getSlug() {
            return slug;
        }
    }]);

    return User;
}();

exports.default = User;