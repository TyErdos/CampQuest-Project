const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');


mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', 
{
    useNewUrlParser: true,
    // useCreateIndex: true, NOT REQUIRED IN NEWER VERSION OF MONGOOSE
    useUnifiedTopology: true
})
.then(() =>
{
    console.log('Database Connected.');
})
.catch(err =>
{    
    console.log("Oh no, a mongo error occurred");
    console.log(err);
})

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => 
{
    await Campground.deleteMany({});
    for(let i = 0; i < 300; i++)
    {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground(
            {
                //YOUR USER ID
                author: "64248077d931d3cdccbeb6d9",
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                title: `${sample(descriptors)} ${sample(places)}`,
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                price,
                geometry: 
                {
                    type: "Point",
                    coordinates: [
                        cities[random1000].longitude,
                        cities[random1000].latitude
                    ]
                },
                images:
                [
                    {
                      url: 'https://res.cloudinary.com/dl1g9gdvt/image/upload/v1680804667/YelpCamp/nature-mountains_ab5m6l.jpg',
                      filename: 'YelpCamp/nature-mountains_ab5m6l'
                    }
                  ]
            })
            await camp.save();
    }
}

seedDB().then(() => 
{
    mongoose.connection.close();
})