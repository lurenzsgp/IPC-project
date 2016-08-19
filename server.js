var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

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

var server = app.listen(3000,function(){
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