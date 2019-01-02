module.exports = class Votes {
    constructor({nickname,
        thread,
        voice,
    }) {
        this.nickname = nickname;
        this.thread = thread;
        this.voice = voice;
    }

    getNickname() {
        return this.nickname;
    }

    getThread() {
        return this.thread;
    }

    getVoice() {
        return this.voice;
    }
}