class Announcement {
    constructor(username, text)
    {
        this.username = username;
        this.text = text;
        this.date = new Date();
    }
}

module.exports = Announcement;