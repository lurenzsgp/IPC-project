var loginController = require('./login');
var data = require('../models/auth')();
var fs = require('fs');	
var multer = require('multer');
var upload = multer({dest: 'public/img/avatars/'});
var Bookshelf = require('bookshelf').mysqlAuth;

module.exports = function(app, passport) {
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

      new data.ApiUser({ username: req.user.get('username') }).fetch().then(function (model) {
          res.render('public/js/missile_command', {
          	level: model.get('level'),
            score: model.get('score'),
          	levelScore: model.get('levelScore')
          });
      });
    });

    app.post('/saveUserState', function(req, res){
        console.log("Saving game state for " + req.user.get('username') + "...");
        var higerLevel = (req.body.level >= req.user.get('level')) ? req.body.level : req.user.get('level');

		// salvataggio nel DB
        new data.ApiUser({
        	id: req.user.get('id'),
        	username: req.user.get('username')
        }).save({
        	level: req.body.level,
        	score: req.body.score,
            levelScore: req.body.levelScore
        }, {patch: true}).then(function(model) {
            req.login(model, function(error) {
                if (!error) {
                   console.log('Successfully saved.');
                }
            });
            res.end();
        }, function(err) {
            console.log("Error while saving: " + err);
        });
    });
	
	app.post('/updateAvatar',  upload.single('avatar'), function(req,res){
		if(req.file){
			var stats = fs.statSync(req.file.path);
			var filesizeinMB = stats["size"] / 1000000.0;

			if(filesizeinMB < 5){
				var file = 'public/img/avatars/' + req.user.get('username');
				
				fs.rename(req.file.path, file, function(err) {
					if (err) {
						console.log(err);
						res.send({
							error: true,
							message: 'Error. Can\'t upload avatar.',
							username: req.user.get('username')
						})
					} else {
						console.log("Avatar updated.");
						res.send({
							error: false,
							message: 'Avatar updated.',
							username: req.user.get('username')
						})
					}
				});
			}else{
				// immagine troppo grande
				res.send({
					error: true,
					message: 'The avatar size must be smaller than 5 MB.',
					username: req.user.get('username')
				})
			}
		}
	});
	
	app.get('/deleteAvatar', function(req,res){
		var file = 'public/img/avatars/' + req.user.get('username');
		
		fs.unlink(file, function(err) {
			if (err) {
				if (err.code=='ENOENT') {
					//console.log('Avatar already deleted.');
					res.send({
						error: true,
						message: 'No custom avatar to delete.',
						username: req.user.get('username')
					})
				} else {
					//console.log('Cannot delete avatar');
					res.send({
						error: true,
						message: 'Cannot delete avatar.',
						username: req.user.get('username')
					});
				}
			} else {
// 				if (confirm('Do you really want to remove your avatar?')) {
					console.log("Avatar deleted.");
					res.send({
						error: false,
						message: 'Avatar deleted.',
						username: req.user.get('username')
					});
// 				}
			}
		});
	});

	// carica i dati dell'utente
    app.get('/getUserData', function(req,res) {
        res.send({
			username: req.user.get('username'),
        	level: req.user.get('level'),
        	levelScore: req.user.get('levelScore')
        });
    });

    app.get('/getLeaderboard', function(req,res) {
        new data.ApiUser().fetchAll().then(function (User) {
            User.query(function(qb) {
                qb.orderBy('score', 'DESC');
            }).fetch({}).then(function(collection){
                // process results
                var users = collection.toJSON();

                res.send([
                    {username: users[0].username, score: users[0].score},
                    {username: users[1].username, score: users[1].score},
                    {username: users[2].username, score: users[2].score}
                ]);
            });
        });
    });

	// associa il badge all'utente
    app.post('/unlockBadge', function(req, res) {
        new data.ApiBadge({ name: req.body.name }).fetch().then(function (badge) {
            if (badge !== null) {
                new data.ApiUserBadge().save({ user_id: req.user.get('id'), badge_id: badge.get('id') })
                .then( function (userBadge) {
                    console.log("Badge " + req.body.name + " unlock");
                }, function (err) {
                    console.log('Error unlock badge: ' + err);
                });
            } else {
                console.log('Error: no badge found.');
            }
        });
    });

    app.post('/checkBadge', function(req, res) {
        new data.ApiBadge({ name: req.body.name }).fetch().then(function (badge) {
            if (badge !== null) {
                new data.ApiUserBadge({ user_id: req.user.get('id'), badge_id: badge.get('id') }).fetch()
                .then( function (userBadge) {
                    if (userBadge === null) {
                        res.send({ unlock: false });
                    } else {
                        res.send({ unlock: true });
                    }
                });
            } else {
                console.log('Error: no badge found.');
            }
        });
    });

	// carica i badge gia' sbloccati
    app.get('/getUserBadge', function(req, res) {
        Bookshelf.knex('badges_users')
        .join('badges', 'badges.id', '=', 'badges_users.badge_id')
        .where('badges_users.user_id', req.user.get('id'))
        .select()
        .then(function (results) {
            res.send(results);
        });
    });

	// mostra in chiaro i dati degli utenti. Accessibile solo tramite URL diretto
    app.get('/user', function(req, res) {
      new data.ApiUser().fetchAll().then(function(users) {
          res.send(users.toJSON());
        }).catch(function(error) {
          console.log(error);
          res.send('An error occured');
        });
    });

	// mostra in chiaro i dati dei badge. Accessibile solo tramite URL diretto
    app.get('/badge', function(req, res) {
      new data.ApiBadge().fetchAll().then(function(badge) {
          res.send(badge.toJSON());
        }).catch(function(error) {
          console.log(error);
          res.send('An error occured');
        });
    });

	// mostra in chiaro i dati dei badge sbloccati dagli utenti. Accessibile solo tramite URL diretto
    app.get('/userBadge', function(req, res) {
      new data.ApiUserBadge().fetchAll().then(function(badge) {
          res.send(badge.toJSON());
        }).catch(function(error) {
          console.log(error);
          res.send('An error occured');
        });
    });

	/*
		FIXME la pagina non viene correttamente renderizzata quando l'URL e' nella forma
		"localhost:3000/index/*" (cioe' quando non corrisponde all'espressione regolare "*")
	*/
    app.get('*', function(req, res) {
    	res.render('404');
    });
}
