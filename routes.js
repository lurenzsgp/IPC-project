var loginController = require('./public/js/login');
var data = require('./public/models/auth')();

module.exports = function (app, passport) {
    app.get('/', function(req, res) {
        res.redirect('/login');
    });

    app.get('/:type(index|home)', function(req, res) {
        res.redirect('/BarbarianSteppe');
    });

    app.get('/BarbarianSteppe', loginController.ensureAuthenticated, loginController.gameIndex);
    app.get('/login', loginController.ensureAuthenticated, loginController.gameIndex);
    app.get('/signup', loginController.ensureSignedUp, loginController.gameIndex);
    app.get('/logout', loginController.logout);

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the login page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/missile_command.js', function(req, res) {
      res.set('Content-Type', 'application/javascript');
      console.log("Rendering missile_command file ...");

      new data.ApiUser({username: req.user.get('username')}).fetch().then(function (model) {
          res.render('public/js/missile_command', { level: model.get('level'), score: model.get('score') });
      });
    });

    app.post('/saveUserState', function(req, res){
        console.log("Salvataggio stato del gioco per " + req.user.get('username'));
        // salvare nel db
        var higerLevel = (req.body.level >= req.user.get('level')) ? req.body.level : req.user.get('level');

        new data.ApiUser({id: req.user.get('id'), username: req.user.get('username')}).save({level: req.body.level, score: req.body.score}, {patch: true}).then(function(model) {
            req.login(model, function(error) {
                if (!error) {
                   console.log('succcessfully updated user');
                }
            });
            res.end();
        }, function(err) {
            console.log("Errore nell'update:" + err);
        });
    });

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
