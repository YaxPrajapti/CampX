const catchAsync = require("../utils/catchAsync");
const { validateReview, isLoggedIn, isReviewer } = require("../middleware");
const express = require('express');
const reviewController = require('../controllers/review')
const router = express.Router({mergeParams: true}); 

  

router.post(
    "/",
    isLoggedIn,
    validateReview, 
    catchAsync(reviewController.postCreateReview)
  );
  
router.delete('/:reviewId', isLoggedIn, isReviewer, catchAsync(reviewController.deleteReview)); 

module.exports = router; 