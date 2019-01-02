module.exports = class Thread {
    constructor({
        author,
        created,
        forum,
        message,
        slug,
        title,
        votes,
        id,
    }) {
        this.author = author;
        this.created = created;
        this.forum = forum;
        this.message = message;
        if (slug != forum) {
            this.slug = slug;
        }
        this.title = title;
        if (votes && votes != 0) { 
            this.votes = votes;
        }
        this.id = parseInt(id, 10);
    }


    getId() {
        return this.id;
    }

    getAuthor() {
        return this.author;
    }

    getCreated() {
        return this.created;
    }

    getForum() {
        return this.forum;
    }

    getMessage() {
        return this.message;
    }

    getTitle() {
        return this.title;
    }

    getVotes() {
        return this.votes;
    }

    getSlug() {
        return this.slug;
    }
}