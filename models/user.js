class User {
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

    toJson() {
        return {
            nickname: this.getNickname(),
            fullname: this.getFullname(),
            email: this.getEmail(),
            about: this.getAbout(),
        }
    }
}

module.exports = User;