// controllers/authController.js
const User = require('../models/User');
const passport = require('passport');

module.exports.renderSignup = (req, res) => {
    res.render('auth/signup');
};

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        
        const user = new User({ username, email, password });
        await user.save();
        
        req.login(user, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Quora Clone!');
            const redirectUrl = res.locals.returnTo || '/posts';
            res.redirect(redirectUrl);
        });
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/signup');
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('auth/login');
};

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/posts';
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) return next(err);
        req.flash('success', 'Goodbye!');
        res.redirect('/posts');
    });
};