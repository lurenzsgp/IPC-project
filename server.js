// set up ======================================================================
// get all the tools we need
var express				= require('express');
var app					= express();
var port				= process.env.PORT || 3000;
var passport			= require('passport');
var flash				= require('connect-flash');
var cookieParser		= require('cookie-parser');
var bodyParser			= require('body-parser');
var session				= require('express-session');
var cookieSession		= require('cookie-session');
var serveStatic			= require('serve-static');
var expressValidator	= require('express-validator');
var swig				= require('swig');
var crypto				= require('crypto');
var path				= require('path');

var dbConfig;
try {
    dbConfig = require('./config/db-conf.js');
} catch(err) {
	console.log('Startup failed. No DB config file found.');
	return false;
}

// configuration ===============================================================

// Knex and Bookshelf: http://bookshelfjs.org/#installation
var knex = require('knex')({
	client: 'postgresql',
	connection: dbConfig,
});
var bookshelf = require('bookshelf');
bookshelf.mysqlAuth = bookshelf(knex);

app.use(serveStatic('./public'));
app.use(bodyParser.urlencoded({	extended: true }));
app.use(bodyParser.json());
app.engine('.html', require('ejs').__express);
app.set('views', __dirname);
app.set('view engine', 'html');

app.use(cookieParser('halyisiHHh445JjO0'));
app.use(cookieSession({
    keys: ['key1', 'key2']
}));
app.use(expressValidator());

// PassportJS: http://passportjs.org/docs/configure
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
// load our routes and pass in our app and fully configured passport
require('./public/js/routes')(app, passport);
require('./public/js/passport')(passport);

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
