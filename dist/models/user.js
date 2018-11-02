"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = function () {
    function User(_ref) {
        var nickname = _ref.nickname,
            fullname = _ref.fullname,
            email = _ref.email,
            about = _ref.about;

        _classCallCheck(this, User);

        this.nickname = nickname;
        this.email = email;
        this.fullname = fullname;
        this.about = about;
    }

    _createClass(User, [{
        key: "getNickname",
        value: function getNickname() {
            return this.nickname;
        }
    }, {
        key: "getEmail",
        value: function getEmail() {
            return this.email;
        }
    }, {
        key: "getFullname",
        value: function getFullname() {
            return this.fullname;
        }
    }, {
        key: "getAbout",
        value: function getAbout() {
            return this.about;
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

    return User;
}();

exports.default = User;