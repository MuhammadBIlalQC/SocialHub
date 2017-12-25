var Announcement = require('./Announcement');
var bcrypt = require('bcrypt');

class User {
    constructor(username, password, dontHashIt) {
        if (username == null || username == undefined)
            throw 'Need Username for new User()';
        if (password == null || password == undefined)
            throw 'Need Password for new User()';
        this.username = username;
        this.password = dontHashIt == true ? password : this.hashPassword(password);
        this.Announcements = [];
        this.friends = [];
        this.friendReqests = [];
        this.friendReqestsSent = [];
    }

    hashPassword(password)
    {
        const hashedPassword = bcrypt.hashSync(password, 10);
        return hashedPassword;
    }

    isPassword(password)
    {
        return bcrypt.compareSync(password, this.password);
    }
    getMessages()
    {
        return this.messages;
    }

    sendMessage(user, message)
    {
        this.messages.push(message);
    }

    recieveFriendRequest(user)
    {
        const username = user.username;

        if (this.friendReqests == null)
        {
            this.friendReqests = [];
        }
        //check to see if friend request was sent by a friend
        if (this.friends != null)
        {
            for (var i = 0; i < this.friends.length; i++) {
                if (this.friends[i] == username)
                    return;
            }
        }
        //check if friend request already exists
        for (var i = 0; i < this.friendReqests.length; i++)
        {
            if (this.friendReqests[i] == username)
                return;
        }
        this.friendReqests.push(username);
    }

    sendFriendRequest(user)
    {
        if (user != null)
        {
            //check to see if user is already a friend
            for (var i = 0; i < this.friends.length; i++)
            {
                if (this.friends[i] == user.username)
                    return user;
            }

            //send friend request to user;
            if (this.friendReqestsSent == null)
                this.friendReqestsSent = [];
            this.friendReqestsSent.push(user.username);
            user.recieveFriendRequest(this);
        }

        return user;
    }

    acceptFriendRequest(user)
    {
        const username = user.username;
        if (this.friends == null)
            this.friends = [];
        for (var i = 0; i < this.friendReqests.length; i++) {
            if (this.friendReqests[i] == username) {
                this.friends.push(username);
                user.friends.push(this.username);
                //remove item by swapping to last element then popping array
                const len = this.friendReqests.length;
                this.friendReqests[i] = this.friendReqests[len - 1];
                this.friendReqests.pop();
            }
        }
    }

    rejectFriendRequest(user)
    {
        const username = user.username;
        if (this.friendReqests != null)
        {
            for (var i = 0; i < this.friendReqests.length; i++)
            {
                if (this.friendReqests[i] == username)
                {
                    //remove item by swapping to last element then popping array
                    const len = this.friendReqests.length;
                    this.friendReqests[i] = this.friendReqests[len - 1];
                    this.friendReqests.pop();
                }
            }

        }
    }

    hasSentFriendRequest(username)
    {
        if (this.friendReqestsSent != null)
        {
            for (var i = 0; i < this.friendReqestsSent.length; i++)
                if (this.friendReqestsSent[i] == username)
                    return true;
        }
        if (this.friendReqests != null)
        {
            for (var i = 0; i < this.friendReqests.length; i++)
                if (this.friendReqests[i] == username)
                    return true;
        }
        return false;
    }

    isFriends(username)
    {
        if (this.friends != null)
        {
            for (var i = 0; i < this.friends.length; i++)
                if (this.friends[i] == username)
                    return true;
        }
        return false;
    }

    async getAnnouncements(database)
    {
        if (database == null)
            throw 'Database is null in User.getAnnouncements()';
        if (this.friends != null)
        {
            const announcements = [];

            for (var i = 0; i < this.friends.length; i++)
            {
                const user = await database.getUser(this.friends[i]);
                if (user.Announcements != null)
                    user.Announcements.forEach(announ => announcements.push(announ));
            }
            console.log(announcements);
            return announcements;
        }
        else
            return this.Announcements;
    }

    postAnnouncement(text)
    {
        if (this.Announcements == null)
            this.Announcements = [];
        this.Announcements.unshift(new Announcement(this.username, text));
    }


    static MakeUserInstance(userObject)
    {
        var user = new User(userObject.username, userObject.password, true);
        user.Announcements = userObject.Announcements;
        user.friends = userObject.friends;
        user.friendReqests = userObject.friendReqests;
        user.friendReqestsSent = userObject.friendReqestsSent;
        user["_id"] = userObject["_id"];
        return user;
    }
}

module.exports = User;


/*
Username should not be case sensitive;
Password is hashed only after initially creating it;
*/