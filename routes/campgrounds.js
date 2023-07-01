const express = require('express');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn, isOwner, validateCampground } = require('../middleware');
const {storage} = require('../cloudinary/cloudinaryConfig'); 
const multer = require('multer'); 
const campgroundController = require('../controllers/campgrounds');

const router = express.Router();
const upload = multer({ storage }); 

router.route('/')
  .get(catchAsync(campgroundController.getAllCampgrounds))
  .post(isLoggedIn,
    validateCampground,
    upload.array('campground[image]'),  
    catchAsync(campgroundController.postNewCampground))


router.route('/new')
  .get(isLoggedIn, campgroundController.getNewCampground)

router.route('/:id')
  .get(catchAsync(campgroundController.getCampground))
  .put(isLoggedIn,
    isOwner,
    validateCampground,
    catchAsync(campgroundController.putEditCampground))
  .delete(isLoggedIn,
    isOwner,
    catchAsync(campgroundController.deleteCampground))

router.route('/:id/edit')
  .get(isLoggedIn,
    isOwner,
    catchAsync(campgroundController.getEditCampground))

module.exports = router; 