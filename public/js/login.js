var crypto		= require('crypto');
var passport	= require('passport');

exports.redirectToGame = function(req, res) {
    // If this function gets called, authentication was successful.
	// req.user contains the authenticated user.
	res.redirect('/desertoDeiBarbari');
}

exports.logout = function(req, res) {
    req.logout();
    req.flash('info', 'You are now logged out.');
    res.redirect('/');
}

exports.ensureAuthenticated = function(req, res, next) {
// 	console.log(req.session);
    if (req.isAuthenticated()) {
    	console.log('Authenticated (session ID ' + req.sessionID + ').');
    	return next();
    }
    
   	console.log('Not authenticated!');
    res.render('login');
}

exports.gameIndex = function(req, res) {
	res.render('index');
}
