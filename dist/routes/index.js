'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = query;

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

var _forum = require('./forum');

var _forum2 = _interopRequireDefault(_forum);

var _thread = require('./thread');

var _thread2 = _interopRequireDefault(_thread);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
import post from './post';
import service from './service'; */

function query(app) {
  app.use('/api/user', _user2.default);
  app.use('/api/forum', _forum2.default);
  // app.use('/api/thread', thread);
  /*
  app.use('/post', post);
  app.use('service', service);
   */
}