const { model } = require('mongoose');
const User = require('../models/user');

module.exports.getRegister = (req, res, next) => {
    res.render("auth/register");
}

module.exports.postRegister = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email: email, username: username });
        const registereduser = await User.register(user, password);
        req.login(registereduser, function (err) {
            if (err) { return next(err); }
            req.flash('success', 'Welcome to YelpCamp!')
            return res.redirect('/campgrounds');
        });

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/auth/register');
    }
}

module.exports.getLogin = (req, res, next) => {
    res.render("auth/login");
}

module.exports.postLogin = (req, res, next) => {
    req.flash("success", `Welcome back, ${req.body.username}`);
    console.log("redirect path...", res.locals.returnTo);
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    res.redirect(redirectUrl);
}

module.exports.getLogout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}