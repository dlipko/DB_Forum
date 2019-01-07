const postController = require('../controllers/post');
const forumController = require('../controllers/forum');
const threadController = require('../controllers/thread');
const userController = require('../controllers/user');
const serviceController = require('../controllers/service');


class ServiceRouter {
    constructor(url, app) {
        app.get(`${url}/status`, getStatus);
        app.post(`${url}/clear`, clear);
    }
}

async function getStatus(req, res) {
    try {
        const counts = await Promise.all([
            forumController.getStatus(),
            postController.getStatus(),
            threadController.getStatus(),
            userController.getStatus(),
        ]);
        const keys = ['forum', 'post', 'thread', 'user', ];
        const answer = Object.assign(...keys.map((k, i) => ({
            [k]: counts[i]
        })));
        return res.status(200).send(answer);
    } catch (error) {
        return res.status(404);
    }
};


async function clear(req, res) {
    try {
        await serviceController.clear();
        return res.status(200).send();
    } catch (error) {
        // console.log(error);
        return res.status(404).send({
            message: `Clear error`,
        });
    }
};

module.exports = ServiceRouter;
