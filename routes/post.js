const Router = require('express-promise-router');
const postController = require('../controllers/post');
const userController = require('../controllers/user');
const threadController = require('../controllers/thread');
const forumController = require('../controllers/forum');

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();

module.exports = router;
// export our router to be mounted by the parent application

router.get('/:id/details', async (req, res) => {
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
      return res.status(404).json({
        message: "Can't find post with id: 2139800938"
      });
    }

    if (related) {
      related = related.split(',');
      console.log(related);
      for (let i = 0; i <related.length; i++) {
        const field = related[i];
        switch(field) {
          case 'user':
          answer.author = await userController.findUserByNickname(post.author);
          console.log('author', answer);
            break;
          case 'thread':
          answer.thread = await threadController.findThreadById(post.thread);
          console.log('thread', answer);
            break;
          case 'forum':
          answer.forum = await forumController.findForumBySlug(post.forum);
          console.log('forum', answer);
            break;
          default:
            break;
        }
      }
    }

    console.log('ANSWER', answer.author);
    return res.status(200).json(answer);


  } catch (error) {
    console.log(error);
    return res.status(409).json({
      message: 'fghjk',
    });
  }
})


router.post('/:id/details', async (req, res) => {
    const {
      id
    } = req.params;
    
      try {
          const post = await postController.updateById(id, req.body.message);
            if (post) {
              return res.status(200).json(post);
            } else {
              return res.status(404).json({
                message: `Can't find thread by slug: ${id}`,
              });
            }
        } catch (error) {
            // console.log(error);
          return res.status(404).json({
          message: `Can't find thread by slug: ${id}`,
        });
      }
  });
