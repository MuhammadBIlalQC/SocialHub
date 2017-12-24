var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var database = require('../Data/Database');
var accountRouter = express.Router();

accountRouter.get('/', function (req, res) {
    //default handler for this call is /signin
    res.redirect('/account/signin');
});

accountRouter.get('/signin', function (req, res) {
    res.render('Signin');
}).post('/signin', async function (req, res) {
    try
    {
        var form = req.body;
        const signinAsUser = form.username;
        const user = await database.getUser(signinAsUser);
        if (user != null)
        {
            //authentication
            res.cookie('user', signinAsUser);

            //on success, redirect to main page
            res.redirect('/');
        }
        else
        {
            res.send('User Does not Exist');
        }
    }

    catch (err)
    {
        console.log(err);
        res.send('Error has occurred while attempting to sign in');
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