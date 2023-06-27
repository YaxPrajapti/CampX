const Campground = require("../models/campground");
const Review = require("../models/review");

exports.postCreateReview = async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review); //this will update the campground and add new review to array of reviews in campground.
    review.reviewer = req.user._id; 
    await review.save(); 
    await camp.save(); 
    console.log("Review posted");
    req.flash('success', 'New review posted'); 
    res.redirect(`/campgrounds/${camp._id}`); 
  }

exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'review deleted');
    res.redirect(`/campgrounds/${id}`);
  }