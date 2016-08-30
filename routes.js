var loginController = require('./public/js/login');
var data = require('./public/models/auth')();

module.exports = function (app, passport) {
    app.get('/', function(req, res) {
        res.redirect('/login');
    });

    app.get('/:type(index|home)', function(req, res) {
        res.redirect('/desertoDeiBarbari');
    });

    app.get('/desertoDeiBarbari', loginController.ensureAuthenticated, loginController.gameIndex);
    app.get('/login', loginController.ensureAuthenticated, loginController.gameIndex);
    app.get('/logout', loginController.logout);

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the login page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

	// TODO eliminare nella versione definitiva
    app.get('/user', function(req, res) {
      new data.ApiUser().fetchAll().then(function(users) {
          res.send(users.toJSON());
        }).catch(function(error) {
          console.log(error);
          res.send('An error occured');
        });
    });

    app.get('/*', function(req, res){
    	res.render('404');
    });
}
