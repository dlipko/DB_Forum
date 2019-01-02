module.exports = class Post {
    constructor({ 
        author,
        created,
        forum,
        message,
        thread,
        parent = 0,
        isEdited,
    }) {
        this.author = author;
        this.created = created;
        this.forum = forum;
        this.message = message;
        this.thread = thread;
        this.parent = parent;
        this.isEdited = isEdited;
    }


    setAuthor(author) {
        this.author = author;
    }

    setForum(forum) {
        this.forum = forum;
    }

    setThread(thread) {
        this.thread = thread;
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

    getThread() {
        return this.thread;
    }

    getParent() {
        return this.parent;
    }

    getIsEdited() {
        return this.isEdited;
    }

    setCreated(created) {
        this.created = created;
    }

    setMessage(message) {
        this.message = message;
    }

    setEdited(edited) {
        isEdited = edited;
    }


}