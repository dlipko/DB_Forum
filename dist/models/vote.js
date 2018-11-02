"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Votes = function () {
    function Votes(_ref) {
        var nickname = _ref.nickname,
            thread = _ref.thread,
            voice = _ref.voice;

        _classCallCheck(this, Votes);

        this.nickname = nickname;
        this.thread = thread;
        this.voice = voice;
    }

    _createClass(Votes, [{
        key: "getNickname",
        value: function getNickname() {
            return nickname;
        }
    }, {
        key: "getThread",
        value: function getThread() {
            return thread;
        }
    }, {
        key: "getVoice",
        value: function getVoice() {
            return voice;
        }
    }]);

    return Votes;
}();

exports.default = Votes;