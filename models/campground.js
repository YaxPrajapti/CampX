const mongoose = require('mongoose');
const Review = require('./review');
const { required, ref, func } = require('joi');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String,
})

imageSchema.virtual('thumbnail_url').get(function () {
    return this.url.replace('/upload', '/upload/w_220');
})

imageSchema.virtual('scaled_image').get(function () {
    return this.url.replace('/upload', '/upload/w_300/h_300');
})


const CampgroundSchema = new Schema({
    title: String,
    image: [imageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, { toJSON: { virtuals: true } });

CampgroundSchema.virtual('properties.popUpMarkUp').get(function () {
    return `<a href="/campgrounds/${this._id}" style="text-decoration: none">${this.title}</a>`
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);

//https://res.cloudinary.com/diyrbdg91/image/upload/w_200/v1719834353/campX/n4oaemzlocq3mim52hdp.png