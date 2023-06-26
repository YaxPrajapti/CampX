const Campground = require("../models/campground");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");
const { validateReview, isLoggedIn, isReviewer } = require("../middleware");
const express = require('express');
const router = express.Router({mergeParams: true}); 

  

router.post(
    "/",
    isLoggedIn,
    validateReview, 
    catchAsync(async (req, res) => {
      const camp = await Campground.findById(req.params.id);
      const review = new Review(req.body.review);
      camp.reviews.push(review); //this will update the campground and add new review to array of reviews in campground.
      review.reviewer = req.user._id; 
      await review.save(); 
      await camp.save(); 
      console.log("Review posted");
      req.flash('success', 'New review posted'); 
      res.redirect(`/campgrounds/${camp._id}`); 
    })
  );
  
  router.delete('/:reviewId', isLoggedIn, isReviewer, catchAsync(async (req, res) => {
      const {id, reviewId} = req.params; 
      await Campground.findByIdAndUpdate(id, {$pull:{reviews : reviewId }}); 
      await Review.findByIdAndDelete(reviewId); 
      req.flash('success', 'review deleted'); 
      res.redirect(`/campgrounds/${id}`); 
  })); 

module.exports = router; 