const Post = require('./post');

module.exports = class Posts {
    constructor(posts) {
        this.posts = [];
        // console.log('POSTS IN MODEL', posts);
        posts.forEach((post) => {
            this.posts.push(new Post(post));
        });
    }
}