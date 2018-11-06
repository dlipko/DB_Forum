'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _expressPromiseRouter = require('express-promise-router');

var _expressPromiseRouter2 = _interopRequireDefault(_expressPromiseRouter);

var _forum2 = require('../controllers/forum');

var _forum3 = _interopRequireDefault(_forum2);

var _thread2 = require('../controllers/thread');

var _thread3 = _interopRequireDefault(_thread2);

var _thread4 = require('../models/thread');

var _thread5 = _interopRequireDefault(_thread4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _expressPromiseRouter2.default();
var forumController = new _forum3.default();
var threadController = new _thread3.default();

exports.default = router;


var SLUG_REGISTERED = 23505;

router.post('/create', async function (req, res) {
  try {
    var forum = await forumController.createForum(req.body.slug, req.body.title, req.body.user);
    return res.status(201).json(forum);
  } catch (error) {
    console.log(error);
    if (error.code == SLUG_REGISTERED) {
      var _forum = await forumController.findForumBySlug(req.body.slug);
      return res.status(409).json(_forum);
    }
    return res.status(404).json({
      "message": "Can't find user with nickname: o.6Wk3ioHf29Bu7V"
    });
  }
});

router.post('/:slug/create', async function (req, res) {
  var slug = req.params.slug;


  if (req.body.slug) slug = req.body.slug;

  console.log(slug);

  console.log('/:slug/create');
  try {
    var thread = await threadController.createThread(req.body.author, req.body.created, req.body.forum, req.body.message, slug, req.body.title);
    return res.status(201).json(thread);
  } catch (error) {
    console.log(error);
    var _thread = new _thread5.default(req.body.author, req.body.created, req.body.forum, req.body.message, slug, req.body.title);
    console.log(_thread);
    return res.status(409).json(_thread);
  }
});

router.get('/:slug/details', async function (req, res) {
  var slug = req.params.slug;

  var user = await forumController.findForumBySlug(slug);
  if (user) {
    return res.status(200).json(user);
  } else {
    return res.status(404).json({
      "message": 'Can\'t find forum with slug ' + slug
    });
  }
});

router.get('/:slug/threads', async function (req, res) {
  var slug = req.params.slug;
  var _req$query = req.query,
      limit = _req$query.limit,
      since = _req$query.since,
      desc = _req$query.desc;


  console.log(limit, since, desc);

  var forum = await forumController.findForumBySlug(slug);
  if (forum) {
    var threads = await forumController.getForumThreads(slug, limit, since, desc);
    return res.status(200).json(threads);
  } else {
    return res.status(404).json({
      "message": 'Can\'t find forum with slug ' + slug
    });
  }

  /*
  if (user) {
    return res.status(200).json(user);
  } else {
    console.log(error);
    return res.status(404).json({
      "message": `Can't find forum with slug ${slug}`
    });
      */
});