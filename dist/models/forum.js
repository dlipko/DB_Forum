"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Forum = function () {
    function Forum(_ref) {
        var slug = _ref.slug,
            title = _ref.title,
            user = _ref.user;

        _classCallCheck(this, Forum);

        this.title = title;
        this.user = user;
        this.slug = slug;
    }

    _createClass(Forum, [{
        key: "getTitle",
        value: function getTitle() {
            return title;
        }
    }, {
        key: "getUser",
        value: function getUser() {
            return user;
        }
    }, {
        key: "getSlug",
        value: function getSlug() {
            return slug;
        }
    }, {
        key: "getPosts",
        value: function getPosts() {
            return posts;
        }
    }, {
        key: "getThreads",
        value: function getThreads() {
            return threads;
        }
    }, {
        key: "toString",
        value: function toString() {
            return "nickname: " + this.getNickname() + "\n\n                fullname: " + this.getFullname() + "\n";
        }
    }, {
        key: "toJson",
        value: function toJson() {
            return {
                nickname: this.getNickname(),
                fullname: this.getFullname(),
                email: this.getEmail(),
                about: this.getAbout()
            };
        }
    }]);

    return Forum;
}();

exports.default = Forum;