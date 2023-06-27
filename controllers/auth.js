const User = require("../models/user");


exports.getRegisterUser = (req, res) => {
    res.render('auth/register.ejs'); 
};

exports.postRegisterUser = async (req, res) => {
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

};

exports.getLogin =  (req, res) => {
    res.render('auth/login.ejs'); 
}; 

exports.postLogin = (req, res) => {
    const redirectUrl = res.locals.returnTo || '/campgrounds'; 
    delete req.session.returnTo; 
    req.flash('success', `welcome back ${req.user.username}`); 
    res.redirect(redirectUrl); 
}

exports.getLogout = (req, res) => {
    req.logOut((err) => {
        if(err){
            return err; 
        }
    }); 
    req.flash('success', "Logged out successfully, GOODBYE!!!")
    res.redirect('/campgrounds'); 
}