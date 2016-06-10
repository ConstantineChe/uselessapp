var LocalStrategy   = require('passport-local').Strategy,
    User = require('../model/user').User,
    db = require('../model/db'),
    bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

    passport.use(new LocalStrategy({
        usernameField: 'email'
    },
        function(username, password, cb) {
            User.findOne({email: username}, function(err, user) {
                if (err) { return cb(err); }
                if (!user) { return cb(null, false); }
                creds = new User;
                creds.password = user.password;
                return creds.comparePassword(password, function(err, isMatch) {
                    if (isMatch) {
                        return cb(null, user);
                    } else {
                        return cb(null, false);
                    }});
            });
        }));
};
