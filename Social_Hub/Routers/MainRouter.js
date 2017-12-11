var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var mainRouter = express.Router();

mainRouter.get('/', function (req, res) {
    if (req.cookies.user == null || req.cookies.user == undefined) {
        res.redirect('/account/signin');
    }
    else
        res.render('Index');
});



module.exports = mainRouter;