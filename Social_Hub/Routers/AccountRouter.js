var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var accountRouter = express.Router();

accountRouter.get('/', function (req, res) {
    //default handler for this call is /signin
    res.redirect('/account/signin');
});

accountRouter.get('/signin', function (req, res) {
    res.render('Signin');
}).post('/signin', function (req, res) {
    var form = req.body;
    if (form.username != "")
    {
        //authentication
        res.cookie('user', form.username);

        //on success, redirect to main page
        res.redirect('/');
    }
    else
    {
        res.send('Error');
    }
});

accountRouter.post('/register', function (req, res) {
    //register new user
    res.send('registration goes here');
});

accountRouter.get('/signout', function (req, res) {
    res.clearCookie('user');
    res.redirect('/account/signin');
})

module.exports = accountRouter;