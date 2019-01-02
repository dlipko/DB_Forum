module.exports = class Post {
    constructor({ 
        author,
        created,
        forum,
        message,
        thread,
        isEdited,
        id,
        thread_id,
    }) {
        this.id = parseInt(id, 10);
        this.author = author;
        this.created = created;
        this.forum = forum;
        this.message = message;
        this.thread = thread;
        this.isEdited = isEdited;
        this.thread = parseInt(thread_id, 10);
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