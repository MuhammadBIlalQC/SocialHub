
class Message {
    constructor(srcUser, dstUser, text) {
        if (srcUser == null || srcUser == undefined)
            throw 'Need srcUser for new Message()';
        if (dstUser == null || dstUser == undefined)
            throw 'Need dstUser for new Message()';
        if (text == null || text == undefined)
            throw 'Need text for new Message()';
        this.srcUser = srcUser;
        this.dstUser = dstUser;
        this.text = text;

        this.date = new Date();
        this.messageID = null;
        if (srcUser < dstUser)
            this.messageID = srcUser + '-' + dstUser;
        else
            this.messageID = dstUser + '-' + srcUser;
    }

    get sourceUser() {
        return this.srcUser;
    }

    get destinationUser() {
        return this.dstUser;
    }

    get messageText() {
        return this.text;
    }
}

module.exports = Message;