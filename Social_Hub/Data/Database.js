'use strict'
var mongoClient = require('mongodb').MongoClient;
var connectionString = "mongodb://localhost:27017/App";

var User = require('./Entities/User');
var Message = require('./Entities/Message');

class Database {
    constructor()
    {
        this.init();
    }

    async init()
    {
        const db = await mongoClient.connect(connectionString);
        db.createCollection('Users', { strict: true }, function (error, collection) {
        });
        db.createCollection('Messages', { strict: true }, function (error, collection) {
        });
    }

    async addUser(username, password)
    {
        const db = await mongoClient.connect(connectionString);
        username = username.toLowerCase(username);
        const userExists = await this.findUser(username, db);
        if (userExists)
        {
            db.close();
            throw 'User already exists';
        }
        else
        {
            const newUser = new User(username, password);

            db.collection("Users").insertOne(newUser, function (err, res) {
                if (err)
                    throw err;

            });
        }

        db.close();
    }

    async deleteUser(username)
    {
        const db = await mongoClient.connect(connectionString);

        const userExists = await this.findUser(username, db);
        if (userExists)
        {
            db.collection("Users").deleteOne({ username: username });
        }
        db.close();
    }
    async findUser(username, db)
    {
        if (db == null)
        {
            const db = await mongoClient.connect(connectionString);
            const user = await db.collection("Users").findOne({ 'username': username });
            db.close();
            if (user == null)
                return false
            else
                return true;
        }
        else
        {
            const user = await db.collection("Users").findOne({ 'username': username });
            if (user == null)
                return false
            else
                return true;
        }
        //default behavior return false
        return false;
    }

    async getUser(username)
    {
        const db = await mongoClient.connect(connectionString);
        const user = await db.collection("Users").findOne({ 'username': username });
        db.close();
        if (user == null)
            return null;
        else
            return User.MakeUserInstance(user);
    }

    async getAllUsers()
    {
        const db = await mongoClient.connect(connectionString);
        const users = await db.collection('Users').find({}).toArray();
        db.close();

        const allUsernames = users.map(function (elem) {
            return elem.username;
        });


        return allUsernames;
    }
    async saveUser(user)
    {
        const db = await mongoClient.connect(connectionString);
        db.collection("Users").updateOne({ "_id": user["_id"] }, user, function (err, res) {
            if (err)
                throw err;
        });
        db.close();
    }

    async getMessages(srcUsername, dstUsername)
    {
        if (srcUsername == null || dstUsername == null)
        {
            throw 'Usernames must be defined to message from a to b';
        }

        const messageId = Message.generateMessageId(srcUsername, dstUsername);
        const db = await mongoClient.connect(connectionString);
        const messages = await db.collection('Messages').find({ messageID: messageId }).toArray();
        db.close();
        return messages;
    }
    async postMessage(srcUsername, dstUsername, text)
    {
        if (srcUsername == null || dstUsername == null)
        {
            throw 'Usernames must be defined to message from a to b';
        }

        const message = new Message(srcUsername, dstUsername, text);

        const db = await mongoClient.connect(connectionString);

        db.collection('Messages').insertOne(message, function (err, res) {
        });

        db.close();
    }

}


var database = new Database();

module.exports = database; 