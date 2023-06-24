const Campground = require("../models/campground");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const { reviewSchema } = require("../validationSchema/schema");
const express = require('express');
const router = express.Router({mergeParams: true}); 



const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body); 
    if(error){
        const msg = error.details.map((er) => el.message.join(", ")); 
        throw new ExpressError(msg, 400); 
    }else{
        next(); 
    }
  }
  

router.post(
    "/",
    validateReview, 
    catchAsync(async (req, res) => {
      const camp = await Campground.findById(req.params.id);
      const review = new Review(req.body.review);
      camp.reviews.push(review); //this will update the campground and add new review to array of reviews in campground.
      await review.save(); 
      await camp.save(); 
      console.log("Review posted");
      req.flash('success', 'New review posted'); 
      res.redirect(`/campgrounds/${camp._id}`); 
    })
  );
  
  router.delete('/:reviewId', catchAsync(async (req, res) => {
      const {id, reviewId} = req.params; 
      await Campground.findByIdAndUpdate(id, {$pull:{reviews : reviewId }}); 
      await Review.findByIdAndDelete(reviewId); 
      req.flash('success', 'review deleted'); 
      res.redirect(`/campgrounds/${id}`); 
  })); 

module.exports = router; 