var express = require('express');
var database = require('../Data/Database');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var User = require('../Data/Entities/User');
var userAPIRouter = express.Router();


userAPIRouter.get('/getusername', function (req, res) {
    res.send(req.cookies);
});

userAPIRouter.get('/getannouncements', async function (req, res) {
    try
    {
        var user = await database.getUser(req.cookies.user);
        const announcements = await user.getAnnouncements(database);
        res.send(announcements);
    }
    catch (e)
    {
        console.log(e);
        res.send([]);
    }
});

userAPIRouter.post('/postannouncement', async function (req, res) {
    var user = await database.getUser(req.cookies.user);
    const post = req.body;
    user.postAnnouncement(post.text);
    database.saveUser(user).catch(e => console.log(e));
    res.send({ 'success': true });
});

module.exports = userAPIRouter;