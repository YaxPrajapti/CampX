const mongoose = require('mongoose'); 

const reviewSchema = mongoose.Schema({
    body: String, 
    rating: Number, 
    reviewer: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }
});

const Review = mongoose.model('Review', reviewSchema); 
module.exports = Review; 
