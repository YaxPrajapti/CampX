const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const flash = require('connect-flash'); 
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const session = require('express-session'); 
const passport = require('passport'); 
const localStrategy = require('passport-local'); 
const ExpressError = require("./utils/ExpressError");
const campgroundRouter = require('./routes/campgrounds'); 
const reviewRouter = require('./routes/reviews'); 
const User = require('./models/user'); 
const authRouter = require('./routes/auth');

mongoose.connect("mongodb://127.0.0.1:27017/campX");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Connection established with database");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());
app.use(passport.initialize()); 
app.use(passport.session()); //passport.session() is used for persistent login sessions. 

passport.use(new localStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser()); //how do you store User in that session. 
passport.deserializeUser(User.deserializeUser()); 

app.use((req, res, next) => {
    res.locals.currentUser = req.user;  
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/auth', authRouter); 
app.use('/campgrounds', campgroundRouter)
app.use('/campgrounds/:id/reviews', reviewRouter);

app.get('/', (req, res) => {
    res.render('home')
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})
