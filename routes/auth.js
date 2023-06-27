const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const authController = require('../controllers/auth');

router.route('/register')
    .get(authController.getRegisterUser)
    .post(catchAsync(authController.postRegisterUser));

router.route('/login')
    .get(authController.getLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/auth/login' }), authController.postLogin)

router.route('/logout')
    .get(authController.getLogout)

module.exports = router; 