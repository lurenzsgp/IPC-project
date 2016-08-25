var loginController = require('./public/assets/js/login');

module.exports = function (app, passport) {
    app.get('/', function(req, res) {
        res.redirect('/login');
    });

    app.get('/:type(index|home)', function(req, res) {
        res.redirect('/desertoDeiBarbari');
    });

    app.get('/desertoDeiBarbari', loginController.ensureAuthenticated, loginController.gameIndex);
    app.get('/login', loginController.ensureAuthenticated, loginController.gameIndex);
    app.post('/login', loginController.checkLogin);
    app.get('/logout', loginController.logout);

    app.get('/*', function(req, res){
    	res.render('404');
    });
}
