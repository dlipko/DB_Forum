const Router = require('express-promise-router');
const postController = require('../controllers/post');
const forumController = require('../controllers/forum');
const threadController = require('../controllers/thread');
const userController = require('../controllers/user');
const serviceController = require('../controllers/service');

const router = new Router();

module.exports = router;

router.get('/status', async (req, res) => {
    try {
        const counts = await Promise.all([
            forumController.getStatus(),
            postController.getStatus(),
            threadController.getStatus(),
            userController.getStatus(),
        ]);
        const keys = ['forum', 'post', 'thread', 'user',];
        const answer = Object.assign(...keys.map((k, i) => ({[k]: counts[i]})));
        return res.status(200).json(answer);
    } catch (error) {
        return res.status(404);
    }
})


router.post('/clear', async (req, res) => {
    try {
        await serviceController.clear();
        return res.status(200).json();
    } catch (error) {
        // console.log(error);
        return res.status(404).json({
            message: `Clear error`,
        });
    }
  });
