const express = require('express');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const authController = require('../controller/authController.js');
const { route } = require('./campgrounds.js');

const router = express.Router();

router.route('/register')
    .get(authController.getRegister)
    .post(catchAsync(authController.postRegister));

router.route('/login')
    .get(authController.getLogin)
    .post(
        storeReturnTo,
        passport.authenticate('local', { failureFlash: "Wrong credentials", failureRedirect: "/auth/login" }),
        authController.postLogin);

router.get('/logout', authController.getLogout);


module.exports = router; 