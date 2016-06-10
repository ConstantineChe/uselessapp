/**
 * Module dependencies
 */

var express = require('express'),
    routes = require('./routes'),
    session = require('express-session'),
    api = require('./routes/api'),
    http = require('http'),
    path = require('path'),
    db = require('./model/db'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    users = require('./model/user'),
    userRoutes  = require('./routes/users');

var app = module.exports = express(),
    server = http.createServer(app),
    passport = require('passport'),
    io = require('socket.io'),
    io = io.listen(server),
    socket = require('./socket/base')(io),
    flash = require('connect-flash');


/**
* Configuration
*/

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.configure(function () {
    app.use(session({
        secret: '(not) a seret',
        resave: false,
        saveUninitialized: true,
        cookie: {secure: false}
    }));
    app.use(express.cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(app.router);
    app.use(flash());
});






var initPassport = require('./passport/init');
initPassport(passport);


// development only
if (app.get('env') === 'development') {
   app.use(express.errorHandler());
};

// production only
if (app.get('env') === 'production') {
  // TODO
}



// Routes
app.get('/', routes.index);
app.post('/signup', routes.signup(passport));
app.post('/login', routes.login(passport));
app.get('/logout', function(req, res) {
    if (req.isAuthenticated()) {
        req.session.destroy(function() {
            res.clearCookie('connect.sid');
            res.redirect('/');
        });
    } else {
        res.redirect('/');
    }
});
app.get('/partial/:name', routes.partial);

// JSON API
app.get('/api/user', api.user);
app.get('/api/board', api.board);
app.get('/api/thread', api.thread);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

/**
* Start Server
*/


server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
