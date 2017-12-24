var express = require('express');
var database = require('../Data/Database');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var User = require('../Data/Entities/User');
var friendAPIRouter = express.Router();


friendAPIRouter.get('/getfriends', async function (req, res) {
    const user = await database.getUser(req.cookies.user);
    res.send(user.friends);
});

friendAPIRouter.get('/getfriendrequests', async function (req, res) {
    const user = await database.getUser(req.cookies.user);
    res.send(user.friendReqests);
});

friendAPIRouter.get('/allpossiblefriends', async function (req, res) {
    var user = await database.getUser(req.cookies.user);
    var allUsers = await database.getAllUsers();
    /* Can Use hashmap for Big O(n) performance*/
    const listOfFriendables = allUsers.filter(function (username) {
        if (user.hasSentFriendRequest(username) || user.isFriends(username) || user.username == username)
            return false;
        return true;
    });
    res.send(listOfFriendables);
});

friendAPIRouter.post('/sendFriendRequest', async function (req, res) {
    try
    {
        const friendUsername = req.body.friendRequestUsername
        var user = await database.getUser(req.cookies.user);
        var friend = await database.getUser(friendUsername);
        user.sendFriendRequest(friend);
        database.saveUser(friend);
        database.saveUser(user);
        res.send(user.friendReqests);
    }
    catch (e)
    {
        console.log(e);
        res.send({'success': false})
    }
});

friendAPIRouter.post('/acceptFriendRequest', async function (req, res) {
    try {
        const friendUsername = req.body.friendRequestUsername;
        var user = await database.getUser(req.cookies.user);
        user = User.MakeUserInstance(user);
        var friend = await database.getUser(friendUsername);
        friend = User.MakeUserInstance(friend);
        user.acceptFriendRequest(friend);
        database.saveUser(user);
        database.saveUser(friend);

        res.send({ 'success': true });
    }

    catch (e)
    {
        console.log(e);
        res.send({'success': false})
    }
});

friendAPIRouter.post('/getmesssages', async function (req, res) {
    try 
    {
        const user = req.cookies.user;
        const friend = req.body.friend;
        if (friend == null) {
            res.send('Error sending friend');
            return;
        }
        const messages = await database.getMessages(user, friend);
        res.send(messages);
    }
    catch (e)
    {
        console.log(e);
        res.send('failed');
    }
});

friendAPIRouter.post('/postmessage', async function (req, res) {
    try {
        const user = req.cookies.user;
        const friend = req.body.friend;
        const message = req.body.message;
        if (friend == null || message == null) {
            res.send('Error sending message');
            return;
        }

        database.postMessage(user, friend, message);
        res.send('ok');
    }
    catch (e) {
        console.log(e);
        res.send('failed');
    }
});
module.exports = friendAPIRouter;