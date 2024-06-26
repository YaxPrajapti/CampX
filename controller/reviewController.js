const Review = require('../models/review.js');
const Campground = require('../models/campground.js');

module.exports.postNewReview = async (req, res) => {
    // console.log(req.params.id);
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.owner = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', "New review posted");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/campgrounds/${id}`);
}