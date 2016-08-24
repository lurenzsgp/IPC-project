var crypto = require('crypto'),
    passport = require('passport')

exports.loginPage = function(req, res) {
    res.render('login/index', {username: req.flash('username')});
}

exports.checkLogin = function(req, res, next) {
//     passport.authenticate('local', function(err, user, info) {
//         if (err || !user) {
//             req.flash('username', req.body.un);
//             req.flash('error', info.message);
//             return res.redirect('/login');
//         }
//         req.logIn(user, function(err) {
//             if (err) {
//                 req.flash('error', info.message);
//                 return res.redirect('/login');
//             }
//             req.flash('success', 'Welcome!');
//             return res.redirect('/home');
//         });
//     })(req, res, next);
	passport.authenticate('local'),
	function(req, res) {
		// If this function gets called, authentication was successful.
		// req.user contains the authenticated user.
		res.redirect('/users/' + req.user.username);
	});
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
