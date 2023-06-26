const mongoose = require('mongoose'); 
const Review = require('./review');
const Schema = mongoose.Schema;     


const CampgroundSchema = new Schema({
    title: String, 
    image: String, 
    price: Number, 
    description: String, 
    location: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
    }, 
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Review' 
        }
    ]
})

//'findOneAndDelete' is inbuilt middleware function. 
//use documentation for better understaing. 
CampgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        // this is remove function where we can write query type arguments. 
        await Review.deleteMany({
            _id: {
                $in: doc.reviews, 
            }
        })
    }
})


const Campground = mongoose.model("Campground", CampgroundSchema); 

module.exports = Campground; 