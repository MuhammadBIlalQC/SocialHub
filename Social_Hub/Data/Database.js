﻿'use strict'
var mongoClient = require('mongodb').MongoClient;
var connectionString = "mongodb://localhost:27017/App";

var User = require('./Entities/User');
var Message = require('./Entities/Message');

class Database {
    constructor()
    {
        //nothing to do yet;
    }

    async addUser(username, password)
    {
        const db = await mongoClient.connect(connectionString);

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

                console.log("1 document inserted");
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
        return user;
    }

    async getAllUsers(username)
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

    async messageUser(srcUsername, dstUsername, text)
    {
        if (srcUsername == null || dstUsername == null)
        {
            throw 'Usernames must be defined to message from a to b';
        }

        const message = new Message(srcUsername, dstUsername, text);

        const db = await mongoClient.connect(connectionString);

        db.collection('Messages').insertOne(message, function (err, res) {
            console.log('ok');
        });

        db.close();
    }
}


var database = new Database();

module.exports = database; 