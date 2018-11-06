module.exports = class Thread {
    constructor({
        author,
        created,
        forum,
        message,
        slug,
        title,
        votes,
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
        this.id = 42;
    }


    getId() {
        return id;
    }

    getAuthor() {
        return author;
    }

    getCreated() {
        return created;
    }

    getForum() {
        return forum;
    }

    getMessage() {
        return message;
    }

    getTitle() {
        return title;
    }

    getVotes() {
        return votes;
    }

    getSlug() {
        return slug;
    }
}