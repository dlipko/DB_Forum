'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _query = require('./query');

var _query2 = _interopRequireDefault(_query);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sql = _fs2.default.readFileSync('init.sql').toString();

exports.default = function () {
    (0, _query2.default)(sql, [], function (err, res) {
        if (err) {
            console.log('db init fail', err);
        }
        console.log('db init success', err);
    });
};