// variables
var dbConfig;
try {
    dbConfig = require('./config/db.conf.js');
} catch(err) {
	console.log('Startup failed. No DB config file found.');
	return false;
}

var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
    passport = require('passport'),
	knex = require('knex')({
		client: 'mysql',
		connection: dbConfig
	}),
    loginController = require('./public/assets/js/login');

var crypto;
try {
	crypto = require('crypto');
} catch (err) {
	console.log('Crypto support is disabled in Node.');
}

var app = express();

// Express
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.engine('.html', require('ejs').__express);
app.set('views', __dirname);
app.set('view engine', 'html');

var server = app.listen(3000, function(){
	console.log("Express is running on port 3000");
});

// routes
app.get('/', function(req, res) {
    res.redirect('/login');
});

app.get('/:type(index|home)', function(req, res) {
    res.redirect('/desertoDeiBarbari');
});

app.get('/desertoDeiBarbari', loginController.ensureAuthenticated, loginController.gameIndex);

app.get('/login', loginController.ensureAuthenticated, loginController.gameIndex);
app.post('/login', loginController.checkLogin);
app.get('/logout', loginController.logout);

app.get('/*', function(req, res){
	res.render('404');
});

app.use(bodyParser.json());
