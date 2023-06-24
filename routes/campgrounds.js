const express = require('express'); 
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../validationSchema/schema');
const router = express.Router(); 

//middleware 


const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(", ");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };

router.get(
    "/",
    catchAsync(async (req, res) => {
      const campgrounds = await Campground.find({});
      res.render("campgrounds/index", { campgrounds });
    })
  );
  
  router.get("/new", (req, res) => {
    res.render("campgrounds/new");
  });
  
  router.post(
    "/",
    validateCampground,
    catchAsync(async (req, res) => {
      const campground = new Campground(req.body.campground);
      await campground.save();
      req.flash('success', 'Campground added successfully'); 
      res.redirect(`/campgrounds/${campground._id}`);
    })
  );
  
  router.get(
    "/:id",
    catchAsync(async (req, res) => {
      const campID = req.params.id;
      const campground = await Campground.findById(campID).populate('reviews');
      // console.log(campground);
      if(!campground){
        req.flash('error', "Campground does not exist"); 
        return res.redirect('/campgrounds'); 
      }
      res.render("campgrounds/show", { campground });
    })
  );
  
  router.get(
    "/:id/edit",
    catchAsync(async (req, res) => {
      const campID = req.params.id;
      const campground = await Campground.findById(campID);
      if(!campground){
        req.flash('error', "Campground does not exist"); 
        return res.redirect('/campgrounds'); 
      }
      res.render("campgrounds/edit", { campground });
    })
  );
  
  router.put(
    "/:id",
    validateCampground,
    catchAsync(async (req, res) => {
      const { id } = req.params;
      const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
      });
      req.flash('success', 'Campground updated!')
      res.redirect(`/campgrounds/${campground._id}`);
    })
  );
  
  router.delete(
    "/:id",
    catchAsync(async (req, res) => {
      const { id } = req.params;
      await Campground.findByIdAndDelete(id);
      req.flash('success', 'Campground deleted succesfully'); 
      res.redirect("/campgrounds");
    })
  );

  
module.exports = router; 