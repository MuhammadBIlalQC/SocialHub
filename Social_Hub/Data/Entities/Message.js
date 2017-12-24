
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
        this.messageID = Message.generateMessageId(srcUser, dstUser);
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

    static generateMessageId(srcUser, dstUser)
    {
        var messageID = '';
        if (srcUser < dstUser)
            messageID = srcUser + '-' + dstUser;
        else
            messageID = dstUser + '-' + srcUser;

        return messageID;
    }
}

module.exports = Message;