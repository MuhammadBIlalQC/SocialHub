'use strict';
var express = require('express');
var app = express();

var middlewareConfig = require('./AppConfiguration/Middleware-Config');
var routerConfig = require('./AppConfiguration/Router-Config');


middlewareConfig(app);
routerConfig(app);

app.listen(80);