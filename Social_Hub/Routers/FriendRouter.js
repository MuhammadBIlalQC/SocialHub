var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var friendRouter = express.Router();

friendRouter.get('/', function (req, res) {
    if (req.cookies.user == null || req.cookies.user == undefined) {
        res.redirect('/account/signin');
    }
    else
        res.render('Friends');
});



module.exports = friendRouter;