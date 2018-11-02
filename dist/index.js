'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _index = require('./routes/index');

var _index2 = _interopRequireDefault(_index);

var _start = require('./db/start');

var _start2 = _interopRequireDefault(_start);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var port = 5000;

app.use(_bodyParser2.default.json());
(0, _index2.default)(app);
(0, _start2.default)();

app.listen(port, function (err) {
    if (err) {
        return console.log('something bad happened', err);
    }
    console.log('server is listening on ' + port);
});