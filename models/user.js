module.exports = class User {
    constructor({
        nickname,
        fullname,
        email,
        about,
    }) {
        this.nickname = nickname;
        this.email = email;
        this.fullname = fullname;
        this.about = about;
    }

    getNickname() {
        return this.nickname;
    }

    getEmail() {
        return this.email;
    }

    getFullname() {
        return this.fullname;
    }

    getAbout() {
        return this.about;
    }

    toString() {
        return `nickname: ${this.getNickname()}\n
                fullname: ${this.getFullname()}\n`;
    }
}