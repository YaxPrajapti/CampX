const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');

exports.getAllCampgrounds = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}; 

exports.getNewCampground = (req, res) => {
    res.render("campgrounds/new");
  }; 

exports.postNewCampground = async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.owner = req.user._id;
    await campground.save();
    req.flash('success', 'Campground added successfully');
    res.redirect(`/campgrounds/${campground._id}`);
  };

exports.getCampground = async (req, res) => {
    const campID = req.params.id;
    const campground = await Campground.findById(campID).populate({ path: 'reviews', populate: { path: 'reviewer' } }).populate('owner');
    // console.log(campground);
    if (!campground) {
      req.flash('error', "Campground does not exist");
      return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show", { campground });
  }

exports.getEditCampground = async (req, res) => {
    const campID = req.params.id;
    const campground = await Campground.findById(campID);
    if (!campground) {
      req.flash('error', "Campground does not exist");
      return res.redirect('/campgrounds');
    }
    res.render("campgrounds/edit", { campground });
  }

exports.putEditCampground = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash('success', 'Campground updated!')
    res.redirect(`/campgrounds/${camp._id}`);
  }

exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted succesfully');
    res.redirect("/campgrounds");
  }