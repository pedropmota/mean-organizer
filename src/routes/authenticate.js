var express = require('express');
var passport = require('passport');

var router = express.Router();

router.get('/success', function(req, res) {
    return res.send({ state: 'success', user: req.user, message: null });
});

router.get('/failure', function(req, res) {
    return res.send({ state: 'failure', user: null, message: req.flash('error')[0] });
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

module.exports = router;
