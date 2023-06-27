const express = require('express');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn, isOwner, validateCampground } = require('../middleware');
const campgroundController = require('../controllers/campgrounds');
const router = express.Router();

router.get(
  "/",
  catchAsync(campgroundController.getAllCampgrounds)
);

router.get("/new", isLoggedIn, campgroundController.getNewCampground);

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(campgroundController.postNewCampground)
);

router.get(
  "/:id",
  catchAsync(campgroundController.getCampground)
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  catchAsync(campgroundController.getEditCampground)
);

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateCampground,
  catchAsync(campgroundController.putEditCampground) 
);

router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  catchAsync(campgroundController.deleteCampground)
);


module.exports = router; 