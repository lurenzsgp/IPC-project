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
	knex = require('knex')({
		client: 'mysql',
		connection: dbConfig
	});

var crypto;
try {
	crypto = require('crypto');
} catch (err) {
	console.log('Crypto support is disabled in Node.');
}

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static('assets));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.engine('.html', require('ejs').__express);
app.set('views', __dirname);
app.set('view engine', 'html');

//require('./routes/index')(app);

var server = app.listen(3000, function(){
	console.log("Express is running on port 3000");
});

app.get('/index', function(req, res){	
	res.render('index');
});

app.get('/', function(req, res){
	res.render('login');
});

app.get('/*', function(req, res){
	res.render('404');
});
