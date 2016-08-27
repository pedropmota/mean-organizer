var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

//Session serialization
passport.serializeUser(function(user, done) {
    done(null, { username: user.username });
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(
    function (username, password, done) {

        //Verify username and password.

        return done(null, {
            username: username
        });
    }));

var router = express.Router();

router.post('/test-login', 
    passport.authenticate('local'), function(req, res) {
        return res.send(req.body.username);
    });

router.post('/login', passport.authenticate('login', {
    successRedirect: '/auth/success',
    failureRedirect: '/auth/failure'
}));

router.get('/is-logged-in', function(req, res) {
    return res.send('Passed through middleware.');
})

// router.get('/is-logged-in', verifyAuthenticationMiddleware,
//      function(req, res) {
//         return res.send('Passed through middleware.');
// });

module.exports = router;
