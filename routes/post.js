const postController = require('../controllers/post');
const userController = require('../controllers/user');
const threadController = require('../controllers/thread');
const forumController = require('../controllers/forum');



class PostRouter {
  constructor(url, app) {
    app.get(`${url}/:id/details`, getPostDetails);
    app.post(`${url}/:id/details`, postPostDetails);
  }
}

async function getPostDetails(req, res) {
  const {
    id
  } = req.params;
  
  let {
    related
  } = req.query;
  
  let answer = {};
  try {
    const post = await postController.findPostById(id);
    
    if (post && Object.keys(post).length != 0) {
      answer.post = post;
    } else {
      return res.status(404).send({
        message: "Can't find post with id: 2139800938"
      });
    }
    let authorPromise, threadPromise, forumPromise;
    if (related) {
      related = related.split(',');
      for (let i = 0; i < related.length; i++) {
        const field = related[i];
        switch (field) {
          case 'user':
          authorPromise = userController.findUserByNickname(post.author);
          break;
          case 'thread':
          threadPromise = threadController.findThreadById(post.thread);
          break;
          case 'forum':
          forumPromise = forumController.findForumBySlug(post.forum);
          break;
          default:
          break;
        }
      }
    }
    
    const [author, thread, forum] = await Promise.all([authorPromise, threadPromise, forumPromise]);
    if (author) answer.author = author;
    if (thread) answer.thread = thread;
    if (forum) answer.forum = forum;
    
    // console.timeEnd('getPostDetails');
    return res.status(200).send(answer);

  } catch (error) {
    // console.log(error);
    return res.status(409).send({
      message: 'fghjk',
    });
  }
};


async function postPostDetails(req, res) {
  const {
    id
  } = req.params;
  
  try {
    const post = await postController.updateById(id, req.body.message);
    if (post) {
      return res.status(200).send(post);
    } else {
      return res.status(404).send({
        message: `Can't find thread by slug: ${id}`,
      });
    }
  } catch (error) {
    // console.log(error);
    return res.status(404).send({
      message: `Can't find thread by slug: ${id}`,
    });
  }
};

module.exports = PostRouter;
