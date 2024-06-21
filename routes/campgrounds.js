const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const { validateCampground, validateReview } = require('../utils/validations.js');
const { isLoggedIn, isAuthorised } = require('../middleware.js');
const campgroundController = require('../controller/campgroundController.js');
const multer = require('multer');
const { storage } = require('../utils/cloudinary.js');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(campgroundController.getCampgrounds))
    // .post(isLoggedIn, validateCampground, catchAsync(campgroundController.postNewCampground));
    .post(upload.array('image'), (req, res) => {
        console.log(req.body, req.files);
        res.send("It worked");
    })

router.get('/new', isLoggedIn, campgroundController.getNewCampground);

router.route('/:id')
    .get(catchAsync(campgroundController.getCampgroundFromId))
    .put(isLoggedIn, isAuthorised, validateCampground, catchAsync(campgroundController.putCampgroundEdit))
    .delete(isAuthorised, catchAsync(campgroundController.deleteCampground));


router.get('/:id/edit', isLoggedIn, isAuthorised, catchAsync(campgroundController.getCampgroundEdit));

module.exports = router; 
