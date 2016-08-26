var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;
var data = require('./models/auth')();

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
        usernameField: 'usr',
        passwordField: 'pwd',
        passReqToCallback : true
    },function(req, username, password, done) {
        console.log('-----------');
        console.log('sign up');
        // TODO controllare che fetch sia sincrono
        new data.ApiUser({username: username}).fetch().then(function (model) {
            if (model === null) {
                req.flash('username', username);
                // req.checkBody('usr', 'Please enter a name.').notEmpty();


                new data.ApiUser().save({"username":username,"password": password,"level":1,"score":0}).then(function(model) {
                    console.log('utente creato');
                    return done(null, model);
                }, function(err) {
                    return done(err);
                });
            } else if (model.get('username') === username) {
                // utente trovato
                console.log('That username is already taken.');
                return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
            }

            var pwd = crypto.createHmac('sha256', password);
        });
        // req.flash('username', username);
        // // req.checkBody('usr', 'Please enter a name.').notEmpty();
        //
        //
        // new data.ApiUser().save({"username":username,"password": password,"level":1,"score":0}).then(function(model) {
        //     console.log('utente creato');
        //     return done(null, model);
        // }, function(err) {
        //     return done(err);
        // });
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
    },function(req, username, password, done) {
        console.log('-----------');
        console.log('login');

        new data.ApiUser({username: username}).fetch().then(function (model) {
            if (model === null) {
                console.log('No user found.');
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            }

            // utente trovato
            console.log('Username found.');

            if (model.get('password') !== password) {
                console.log('Oops! Wrong password.');
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            }


            req.flash('username', username);
            console.log('Password correct.');
            return done(null, model);
        });
    }));
};
