const threadController = require('../controllers/thread');
const postController = require('../controllers/post');
const voteController = require('../controllers/vote');


const EMAIL_REGISTERED = 23505;

class ThreadRouter {
  constructor(url, app) {
    app.post(`${url}/:slugOrId/create`, createThread);
    app.post(`${url}/:slugOrId/vote`, vote);
    app.get(`${url}/:slugOrId/details`, getThreadDetails);
    app.post(`${url}/:slugOrId/details`, postThreadDetails);
    app.get(`${url}/:slugOrId/posts`, getPosts);
  }
}

async function createThread(req, res) {
  try {
  const {
    slugOrId
  } = req.params;
  const thread = /^[0-9]*$/i.test(slugOrId) ? await threadController.findThreadById(slugOrId) :
  await threadController.findThreadBySlug(slugOrId);
  
  if (!thread) {
    return res.status(404).send({
      message: `Can't find post thread by id: ${slugOrId}`,
    });
  }
  
  if (!req.body.length) {
    return res.status(201).send([]);
  }
  
    const posts = await postController.createPosts(req.body, thread);
    if (posts.length) {
      return res.status(201).send(posts);
    } else {
      return res.status(404).send({
        message: `Can't find post thread by id: ${slugOrId}`,
      });
    }
  } catch (error) {
    // console.log(error);
    // console.log('ERROR CODE', error.code);
    if (error.code === '23502') {
      return res.status(404).send({
        message: `Can't find post author by nickname:`,
      });
    }
    return res.status(409).send({
      message: `Can't find post author by nickname:`,
    });
  }
};


async function vote(req, res) {
  const {
    slugOrId
  } = req.params;
  
  
  try {
    const vote = await voteController.createVote(req.body.nickname, slugOrId, req.body.voice);
    return res.status(200).send(vote);
  } catch (error) {
    // console.log(slugOrId);
    // console.log('/:slugOrId/vote', error);
    return res.status(404).send({
      message: `Can't find user by nickname: ${slugOrId} ${req.body.nickname}`,
    });
  }
};


async function getThreadDetails(req, res) {
  const {
    slugOrId
  } = req.params;
  
  try {
    const thread = /^[0-9]*$/i.test(slugOrId) ? await threadController.findThreadById(slugOrId) :
    await threadController.findThreadBySlug(slugOrId);
    if (thread) {
      return res.status(200).send(thread);
    } else {
      return res.status(404).send({
        message: `Can't find thread by slug: ${slugOrId}`,
      });
    }
  } catch (error) {
    // console.log('details get', error);
    return res.status(100500).send([]);
  }
};


async function postThreadDetails(req, res) {
  const {
    slugOrId
  } = req.params;
  
  if (req.body.message || req.body.title) {
    try {
      const thread = /^[0-9]*$/i.test(slugOrId) ? await threadController.updateById(slugOrId, req.body.message, req.body.title) :
      await threadController.updateBySlug(slugOrId, req.body.message, req.body.title);
      if (thread) {
        return res.status(200).send(thread);
      } else {
        return res.status(404).send({
          message: `Can't find thread by slug: ${slugOrId}`,
        });
      }
    } catch (error) {
      return res.status(404).send({
        message: `Can't find thread by slug: ${slugOrId}`,
      });
    }
  } else {
    try {
      const thread = /^[0-9]*$/i.test(slugOrId) ? await threadController.findThreadById(slugOrId) :
      await threadController.findThreadBySlug(slugOrId);
      if (thread) {
        return res.status(200).send(thread);
      } else {
        return res.status(404).send({
          message: `Can't find thread by slug: ${slugOrId}`,
        })
      }
    } catch {
      return res.status(404).send({
        message: `Can't find thread by slug: ${slugOrId}`,
      })
    }
  }
};

async function getPosts(req, res) {
  const {
    slugOrId
  } = req.params;
  
  const {
    limit,
    since,
    desc,
    sort,
  } = req.query;
  
  let threadId = slugOrId;
  
  try {
    const thread = /^[0-9]*$/i.test(slugOrId) ? await threadController.findThreadById(slugOrId) :
    await threadController.findThreadBySlug(slugOrId);
    if (!thread) {
      return res.status(404).send({
        message: "Can't find thread by slug: t3v-xm1hE6sOk"
      });
    }
    threadId = thread.id;
    
    let posts;
    switch (sort) {
      case 'flat':
      posts = await postController.flatSort({
        threadId,
        limit,
        since,
        desc
      });
      break;
      case 'tree':
      posts = await postController.treeSort({
        threadId,
        limit,
        since,
        desc
      });
      break;
      case 'parent_tree':
      posts = await postController.parentTreeSort({
        threadId,
        limit,
        since,
        desc
      });
      break;
      default:
      posts = await postController.flatSort({
        threadId,
        limit,
        since,
        desc
      });
      break;
    }
    
    if (posts) {
      return res.status(200).send(posts.posts);
    } else {
      return res.status(200).send([]);
    }
    
  } catch (error) {
    // console.log(error);
    return res.status(404).send({
      message: "Can't find thread by slug: t3v-xm1hE6sOk"
    });
  }
};

module.exports = ThreadRouter;
