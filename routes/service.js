const Router = require('express-promise-router');
const postController = require('../controllers/post');
const forumController = require('../controllers/forum');
const threadController = require('../controllers/thread');
const userController = require('../controllers/user');

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
        // const forum = await forumController.getStatus();
        // const post = await postController.getStatus();
        // const thread = await threadController.getStatus();
        // const user = await userController.getStatus();
        // console.log('PROMISE ALL', answer);
        const keys = ['forum', 'post', 'thread', 'user',];
        
        const answer = Object.assign(...keys.map((k, i) => ({[k]: counts[i]})))
        console.log('ANSWER', answer);
        
        return res.status(200).json(answer);
    } catch (error) {
        return res.status(404);
    }
})


// router.post('/:id/details', async (req, res) => {
//     const {
//       id
//     } = req.params;
    
//       try {
//           const post = await postController.updateById(id, req.body.message);
//             if (post) {
//               return res.status(200).json(post);
//             } else {
//               return res.status(404).json({
//                 message: `Can't find thread by slug: ${id}`,
//               });
//             }
//         } catch (error) {
//             console.log(error);
//           return res.status(404).json({
//           message: `Can't find thread by slug: ${id}`,
//         });
//       }
//   });
