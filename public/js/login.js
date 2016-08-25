var crypto = require('crypto');
var passport = require('passport')

exports.loginPage = function(req, res) {
    res.render('login/index', {username: req.flash('username')});
}

exports.checkLogin = function(req, res, next) {
    console.log("Login utente: " + req.body.username);
    passport.authenticate('local', function(err, user, info) {
        if (err || !user) {
            req.flash('username', req.body.username);
            req.flash('error', info.message);
            return res.redirect('/login');
        }
        req.logIn(user, function(err) {
            if (err) {
                req.flash('error', info.message);
                return res.redirect('/login');
            }
            req.flash('success', 'Welcome!');
            return redirectToGame(res, req);
        });
    })(req, res, next);
}

exports.registerPost = function(req, res) {
    var pwd = req.body.password;
    var un = req.body.username;

    req.flash('username', un);

    // req.checkBody('username', 'Please enter a valid email.').notEmpty().isEmail();
    req.checkBody('username', 'Please enter a name.').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var msg = errors[0].msg;
        req.flash('error', msg);
        res.redirect('/login');
        return;
    }

    var new_salt = Math.round((new Date().valueOf() * Math.random())) + '';
    var pw = crypto.createHmac('sha1', new_salt).update(pwd).digest('hex');
    var created = new Date().toISOString().slice(0, 19).replace('T', ' ');

// TODO controlla i nomi dei campi che penso debbano coincidere con quelli del nostro db
    new data.ApiUser({email: un, password: pw, salt: new_salt, created: created}).save().then(function(model) {
        passport.authenticate('local')(req, res, function () {
            redirectToGame(res, req);
        })
    }, function(err) {
        req.flash('error', 'Unable to create account.');
        res.redirect('/login');
    });
}

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
    if (req.isAuthenticated()) {
    	return next();
    }
    res.render('login');
}

exports.gameIndex = function(req, res){
	res.render('index');
}
