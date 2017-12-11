'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var handlebars = require('express-handlebars');


function appMiddlewareConfig(app)
{
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());

    app.engine('.hbs', handlebars({ extname: '.hbs' }));
    app.set('view engine', '.hbs');

    app.use(express.static('Views'));
    app.use(express.static('Public'));
}


module.exports = appMiddlewareConfig;