const express = require('express'); 
const User = require('../models/user'); 
const router = express.Router(); 
const catchAsync = require('../utils/catchAsync'); 
const passport = require('passport');
const { storeReturnTo } = require('../middleware');


router.get('/register', (req, res) => {
    res.render('auth/register.ejs'); 
}); 
router.post('/register', catchAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email: email, username: username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', `Welcome to CampX ${username}`);
            res.redirect('/campgrounds');
        }) 
    }catch(err){
        req.flash('error', err.message);
        res.redirect('/auth/register');  
    }

})); 

router.get('/login', (req, res) => {
    res.render('auth/login.ejs'); 
})
router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/auth/login'}), (req, res) => {
    const redirectUrl = res.locals.returnTo || '/campgrounds'; 
    delete req.session.returnTo; 
    req.flash('success', `welcome back ${req.user.username}`); 
    res.redirect(redirectUrl); 
}); 

router.get('/logout', (req, res) => {
    req.logOut((err) => {
        if(err){
            return err; 
        }
    }); 
    req.flash('success', "Logged out successfully, GOODBYE!!!")
    res.redirect('/campgrounds'); 
})


module.exports = router; 