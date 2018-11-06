class Votes {
    constructor({nickname,
        thread,
        voice,
    }) {
        this.nickname = nickname;
        this.thread = thread;
        this.voice = voice;
    }

    getNickname() {
        return nickname;
    }

    getThread() {
        return thread;
    }

    getVoice() {
        return voice;
    }
}

module.exports = Votes;