const express = require('express');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground.js');
const Review = require('../models/review.js');
const { validateReview } = require('../utils/validations.js');
const { isLoggedIn, isReviewAuthorised } = require('../middleware.js');
const reviewController = require('../controller/reviewController.js');

const router = express.Router({ mergeParams: true });

router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.postNewReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthorised, catchAsync(reviewController.deleteReview));

module.exports = router; 