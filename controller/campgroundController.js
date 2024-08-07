const Campground = require('../models/campground');
const { cloudinary } = require('../utils/cloudinary');
const mapBoxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding-v6')
const mapboxToken = process.env.MAPBOX_TOKEN
const geoCoder = mapBoxGeocoding({ accessToken: mapboxToken });

module.exports.getCampgrounds = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.getNewCampground = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.postNewCampground = async (req, res, next) => {
    console.log(req.body.campground.location);
    const location = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1 
    }).send(); 
    const resBody = JSON.parse(location.rawBody)
    const coordinate = resBody.features[0].geometry; 
    const campground = new Campground(req.body.campground);
    campground.geometry = coordinate; 
    campground.owner = req.user._id; // save loggedin user as owner. 
    campground.image = req.files.map(file => ({
        url: file.path,
        filename: file.filename
    }));
    console.log(campground);
    await campground.save();
    req.flash('success', "New campground is created");
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.getCampgroundFromId = async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'owner',
            select: 'username email'
        }
    }).populate('owner', 'username email');
    // console.log(campground);
    if (!campground) {
        req.flash("error", "This campground does not exist anymore");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

module.exports.getCampgroundEdit = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash("error", "This campground does not exist anymore");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.putCampgroundEdit = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    if (!campground) {
        req.flash("error", "This campground does not exist anymore");
        return res.redirect('/campgrounds');
    }
    const images = req.files.map(file => ({
        url: file.path,
        filename: file.filename
    }));
    images.forEach(image => {
        campground.image.push(image);
    });
    await campground.save();
    if (req.body.deleteImage) {
        for(let filename of req.body.deleteImage){
            await cloudinary.uploader.destroy(filename); 
        }
        await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImage } } } })
        console.log(campground);
    }
    req.flash('success', 'Campground updated');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}