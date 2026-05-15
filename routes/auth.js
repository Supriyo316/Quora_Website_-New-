// routes/auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const { saveReturnTo } = require('../middleware/auth');

router.route('/signup')
    .get(authController.renderSignup)
    .post(saveReturnTo, authController.signup);

router.route('/login')
    .get(authController.renderLogin)
    .post(
        saveReturnTo,
        passport.authenticate('local', {
            failureFlash: true,
            failureRedirect: '/login',
            keepSessionInfo: true
        }),
        authController.login
    );

router.get('/logout', authController.logout);

module.exports = router;