exports.logout = function(req, res) {
    req.logout();
    req.flash('info', 'You are now logged out.');
    res.redirect('/');
}

exports.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
    	console.log('Authenticated (session ID ' + req.sessionID + ').');
    	return next();
    } else {    
		console.log('Not authenticated!');
		res.render('login');
    }
}

exports.gameIndex = function(req, res) {
	console.log('Game index requested.');
    res.render('index');
}
