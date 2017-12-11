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
    var user = await database.getUser(req.cookies.user);
    res.send(user.Announcements);
});

userAPIRouter.post('/postannouncement', async function (req, res) {
    var user = await database.getUser(req.cookies.user);
    const post = req.body;
    user = User.MakeUserInstance(user);
    user.postAnnouncement(post.text);
    database.saveUser(user).catch(e => console.log(e));
    res.send({ 'success': true });
});

module.exports = userAPIRouter;