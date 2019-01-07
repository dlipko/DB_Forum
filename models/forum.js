module.exports = class Forum {
    constructor({
        slug,
        title,
        user,
        posts,
        threads,
    }) {
        this.title = title;
        this.user = user;
        this.slug = slug;
        this.posts = posts;
        this.threads = threads;

        // console.log('CREATE FORUM', this);
    }

    getTitle() {
        return title;
    }

    getUser() {
        return user;
    }

    getSlug() {
        return slug;
    }

    getPosts() {
        return posts;
    }

    getThreads() {
        return threads;
    }

    toString() {
        return `nickname: ${this.getNickname()}\n
                fullname: ${this.getFullname()}\n`;
    }
}