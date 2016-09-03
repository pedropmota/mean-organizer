var express = require('express');
var mongoose = require('mongoose');
var crypto = require('crypto');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var User = mongoose.model('User');

//Session serialization
passport.serializeUser(function(user, done) {
    done(null, { username: user.username, id: user._id });
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use('login', new LocalStrategy({
        passReqToCallback : true
    },
    function (req, username, password, done) {
        User.findOne({ username: username }, function(err, user) {
            if (err)
                return done(err);
            
            if (!user)
                return done(null, false, req.flash('error', 'incorrect username.' ));
            
            if (user.password !== generateMD5Hash(password))
                return done(null, false, req.flash('error', 'incorrect password.' ));

            return done(null, user);
        });
    }
));

passport.use('signup', new LocalStrategy({
        passReqToCallback: true
    },
    function(req, username, password, done) {
        if (!username)
            return done(null, false, req.flash('error', 'please enter a username.' ));
        if (!password)
            return done(null, false, req.flash('error', 'please enter a password.' ));
        
        User.findOne({ username: username }, function(err, existingUser) {
            if (err)
                return done(err);
           
            if (existingUser)
                return done(null, false, req.flash('error', 'username already taken.' ));
            
            var user = new User();
            user.username = username;
            user.password = generateMD5Hash(password);
            user.save(function(err, newUser) {
                if (err)
                    return done(err);
                
                return done(null, newUser);
            });
        });
    }
));

var router = express.Router();

router.get('/success', function(req, res) {
    return res.send({ state: 'success', user: req.user, message: null });
});

router.get('/failure', function(req, res) {
    return res.send({ state: 'failure', user: null, message: req.flash('error')[0] });
});

router.post('/test-login', 
    passport.authenticate('login'), function(req, res) {
        return res.send(req.body.username);
    });

router.post('/login', 
    passport.authenticate('login', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure',
        flashMessage: true
    })
);

router.post('/register', 
    passport.authenticate('signup', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure',
        flashMessage: true
    })
);

router.get('/logout', function(req, res) {
    req.logout();
    return res.send('logged out');
});

router.get('/login-status', function(req, res) {
    return res.send({ 
        isLoggedIn: req.isAuthenticated(),
        username: req.isAuthenticated() ? req.user.username : null
    });
});

function generateMD5Hash(input) {
    return crypto.createHash('md5').update(input).digest('hex');
}

module.exports = router;
