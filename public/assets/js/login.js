var crypto = require('crypto'),
    passport = require('passport')

exports.loginPage = function(req, res) {
    res.render('login/index', {username: req.flash('username')});
}

exports.checkLogin = function(req, res) {
	passport.authenticate('local'),
	function(req, res) {
		// If this function gets called, authentication was successful.
		// req.user contains the authenticated user.
        console.log(req.body.user.name);
		res.redirect('/desertoDeiBarbari/' + req.body.user.name);
	};
}

exports.logout = function(req, res) {
    req.logout();
//     req.flash('info', 'You are now logged out.');
    res.redirect('/');
}

exports.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.render('login');
}

exports.gameIndex = function(req, res){
	res.render('index');
}
