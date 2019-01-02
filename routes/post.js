const Router = require('express-promise-router');
const postController = require('../controllers/post');

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

  try {
    const post = await postController.findPostById(id);
    return res.status(200).json({ post });
  } catch (error) {
    return res.status(404).json(users);
  }
})
