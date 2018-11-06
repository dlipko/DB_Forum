module.exports = class Post {
    constructor({ 
        author,
        created,
        forum,
        message,
        thread,
        parent,
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

    getThread() {
        return thread;
    }

    getParent() {
        return parent;
    }

    getIsEdited() {
        return isEdited;
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