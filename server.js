var express    =    require('express');
var app        =    express();

/*
require('./routes/main')(app);				//router file
app.set('views',__dirname + '/views');		//where html file are placed
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
*/

require('./routes/index')(app);

var server = app.listen(3000,function(){
	console.log("Express is running on port 3000");
});