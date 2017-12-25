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
        const signinAsUserPassword = form.password;
        const user = await database.getUser(signinAsUser);
        if (user != null)
        {
            if (user.isPassword(signinAsUserPassword))
            {
                res.cookie('user', signinAsUser);
                res.redirect('/');
            }
            else
            {
                res.render('Signin', { invalid: 'Invalid Username or Password' });
            }
        }
        else
        {
            res.render('Signin', { invalid: 'Invalid Username or Password' });
        }
    }

    catch (err)
    {
        console.log(err);
        res.send('Error has occurred while attempting to sign in');
    }
});

accountRouter.post('/register', async function (req, res) {
    try 
    {
        const username = req.body.reg_username;
        const password = req.body.reg_password;
        
        if (username == null || password == null)
        {
            res.render('Signin');
            return;
        }
        const validation = validateAccount(username, password);
        if (validation != '')
        {
            res.render('Signin', { validation: validation });
            return
        }
        const user = await database.getUser(username);
        if (user != null)
        {
            res.render('Signin', { validation: 'Username already exists' });
            return
        }
        else
        {
            await database.addUser(username, password);
            res.cookie('user', username);
            res.redirect('/')
        }
        
        
    }
    catch (e)
    {
        res.send('failed');
    }
});

accountRouter.get('/signout', function (req, res) {
    res.clearCookie('user');
    res.redirect('/account/signin');
});

function validateAccount(username, password)
{
    var validation = '';
    if (username.length < 8)
        validation += 'Username must be at least 6 characters. ';
    if (password.length < 6)
        validation += 'Password must be at least 6 characters.';
    return validation;
}

module.exports = accountRouter;