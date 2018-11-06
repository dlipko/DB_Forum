class Forum {
    constructor({
        slug,
        title,
        user,
    }) {
        this.title = title;
        this.user = user;
        this.slug = slug;
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

    toJson() {
        return {
            nickname: this.getNickname(),
            fullname: this.getFullname(),
            email: this.getEmail(),
            about: this.getAbout(),
        }
    }
}

module.exports = Forum;