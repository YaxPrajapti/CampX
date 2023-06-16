const mongoose = require('mongoose'); 
const Campground = require('../models/campground'); 
const cities = require('./cities'); 
const {places, descriptors} = require('./seedHelpers');  

mongoose.connect('mongodb://127.0.0.1:27017/campX'); 
const db = mongoose.connection; 
db.on("error", console.error.bind(console, "connection error")); 
db.once("open", () => {
    console.log("Connection established with database");
})

const sample = array => array[Math.floor(Math.random() * array.length)]; 


const seedDB = async () => {
    await Campground.deleteMany({}); 
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random()*1000); 
        const randomPrice = Math.floor(Math.random()*20) + 10
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city} ${cities[random1000].state}`,
            image: `https://source.unsplash.com/random/1100x500?camping,${i}`,
            description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem deleniti reiciendis sint fugit qui, saepe excepturi dolores magnam quas laboriosam blanditiis error et ipsam esse nemo quos similique cupiditate explicabo?`,
            price: randomPrice
        })
        await camp.save(); 
    }
}

seedDB(); 