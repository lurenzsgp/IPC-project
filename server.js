// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;
// var mongoose = require('mongoose'); // per server mongodb
var passport = require('passport');
var flash    = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var cookieSession = require('cookie-session');
var serveStatic = require('serve-static');
var expressValidator = require('express-validator');
var swig = require('swig');
var crypto = require('crypto');
var path = require('path');

var dbConfig;
try {
    dbConfig = require('./config/db.conf.js');
} catch(err) {
	console.log('Startup failed. No DB config file found.');
	return false;
}

var knex = require('knex')({
		client: 'mysql',
		connection: dbConfig
	});
var Bookshelf = require('bookshelf');

// configuration ===============================================================

// required for passport
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


app.use(serveStatic('./public'));
app.use(bodyParser.urlencoded({	extended: true }));
app.use(bodyParser.json());
app.engine('.html', require('ejs').__express);
app.set('views', __dirname);
app.set('view engine', 'html');

Bookshelf.mysqlAuth = Bookshelf(knex);

app.use(cookieParser('halsisiHHh445JjO0'));
app.use(cookieSession({
    keys: ['key1', 'key2']
}));

app.use(expressValidator());

// routes ======================================================================
require('./routes')(app, passport); // load our routes and pass in our app and fully configured passport

//
require('./passport')(passport);

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
