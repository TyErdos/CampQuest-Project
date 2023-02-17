const mongoose = require('mongoose');
const Schema = mongoose.Schema; //used as a shortcut 

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
})

module.exports = mongoose.model('Campground', CampgroundSchema);
