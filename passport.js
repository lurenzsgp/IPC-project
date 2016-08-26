var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;
var data = require('./public/models/auth')();

module.exports = function(passport) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user_id, done) {
        new data.ApiUser({id: user_id}).fetch().then(function(user) {
            return done(null, user);
        }, function(error) {
            return done(error);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback : true
    },function(req, name, password, done) {
        console.log(name);
        console.log(password);

        var user = new data.ApiUser({username: name}).fetch().then(function () {
            // utente trovato
            console.log('That username is already taken.');
            return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
        });
        console.log('username free.');
        // req.flash('username', name);
        // req.checkBody('usr', 'Please enter a name.').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            var msg = errors[0].msg;
            req.flash('error', msg);
            res.redirect('/login');
            return;
        }

        var pwd = crypto.createHmac('sha256', password);

        var user = new data.ApiUser({username: name, password: pwd, level: 1, score: 0}).save().then(function(model) {
            // passport.authenticate('local-login')(req, res, function () {
            //     redirectToGame(res, req);
            // });
            console.log('utente creato');
            return done(null, user);
        }, function(err) {
            return done(err);
            // req.flash('error', 'Unable to create account.');
            // res.redirect('/login');
        });
    }));

    // =========================================================================
    // LOCAL LOGIN ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback : true
    },function(req, name, password, done) {
        var user = new data.ApiUser({username: name}).fetch().then(function () {
            // utente trovato
            console.log('Username correct.');
            var pwd = crypto.createHmac('sha256', password);
            var user = new data.ApiUser({username: name, password: pwd}).fetch().then(function () {
                console.log('Password correct.');
                return done(null, user);
            }, function (err) {
                console.log('Oops! Wrong password.');
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            });

        }, function (err) {
            console.log('No user found.');
            return done(null, false, req.flash('loginMessage', 'No user found.'));
        });

    }));
};
