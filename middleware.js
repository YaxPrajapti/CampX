const Campground = require("./models/campground");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("./validationSchema/schema");


const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', "You must login first");
    return res.redirect('/auth/login');
  }
  next();
}

const storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
}

const isOwner = async (req,res,next) => {
  const {id} = req.params; 
  const campground = await Campground.findById(id); 
  // console.log(req.user); 
  // console.log(campground.owner.equals(req.user._id)); 
  if(!campground.owner.equals(req.user._id)){
    req.flash('error', `Only owner of ${campground.title} can edit`); 
    return res.redirect(`/campgrounds/${id}`); 
  } 
  next(); 
}

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const {error} = reviewSchema.validate(req.body); 
  if(error){
    const msg = error.details.map((er) => Array.isArray(er.message) ? er.message.join(", ") : er.message);
    throw new ExpressError(msg, 400); 
  }else{
      next(); 
  }
}; 

const isReviewer = async (req, res, next) => {
  const {id, reviewId} = req.params; 
  const review = await Review.findById(reviewId); 
  if(!review.reviewer.equals(req.user._id)){
    req.flash('error', 'You do not have permission to delete the review'); 
    return res.redirect(`/campgrounds/${id}`)
  }
  next(); 
}

module.exports = {isLoggedIn, storeReturnTo, isOwner, validateCampground, validateReview, isReviewer}; 