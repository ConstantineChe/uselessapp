/*
 * GET home page.
 */
var User = require('../model/user').User;

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
};


exports.signup = function(passport) {
    return function(req, res) {
        var body = req.body;
        if (body.password == body.confPassword) {
            User.findOne({email:  body.email}, function(err, user) {
                    if (err){
                        console.log('Error in SignUp: '+err);
                        return res(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User with email: ' + body.email + ' is already exists.');
                        res.json({error: 'User with email: ' + body.email + ' is already exists.'});
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUser = new User();
                        newUser.email = body.email;
                        newUser.name = body.name;
                        newUser.password = body.password;
                        newUser.save(function(err) {
                            if (err) {
                                console.log('Error in Saving user: ' + err);
                                throw err;
                            }
                            res.json(newUser);
                        });
                    }
            });
        }
            res.json({error: 'Password doesnt match with confirmation.'});

    };
};


exports.login = function(passport) {
    return function(req, res, next) {
        passport.authenticate('local', {failureRedirect: '/login'},
                              function(err, user, info) {
                                  if (err) {
                                      console.log(err);
                                  }
                                  if (!user) {
                                      return res.redirect('/login');
                                  }
                                  req.login(user, function(err) {
                                      if (err) { return next(err); }
                                  });
                                  res.json(user);
                              })(req, res);
    };
};


exports.index = function(req, res) {
    res.render('index');
};

exports.partial = function (req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
};
