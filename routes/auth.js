const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const authController = require('../controllers/auth');


router.get('/register', authController.getRegisterUser);
router.post('/register', catchAsync(authController.postRegisterUser));

router.get('/login', authController.getLogin);

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/auth/login' }), authController.postLogin);

router.get('/logout', authController.getLogout);


module.exports = router; 