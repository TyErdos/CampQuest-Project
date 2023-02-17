const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('./models/campground');


mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', 
{
    useNewUrlParser: true,
    // useCreateIndex: true,                      NOT REQUIRED IN NEWER VERSION OF MONGOOSE
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


const app = express();


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));


app.get('/', (req, res) =>
{
    res.render('home')
})


app.get('/campgrounds', async (req, res) => 
{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
})

app.get('/campgrounds/new', (req, res) => 
{
    res.render('campgrounds/new');

})

app.post('/campgrounds', async (req,res) => 
{
   const campground = new Campground(req.body.campground);
   await campground.save();
   res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds/:id', async (req, res) =>
{
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', {campground});
})

app.get('/campgrounds/:id/edit', async (req, res) =>
{
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', {campground});
})

app.put('/campgrounds/:id', async (req, res) => 
{
    const {id} = req.params;
    const campground =  await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true});
    res.redirect(`/campgrounds/${campground._id}`);
})

app.delete('/campgrounds/:id', async (req, res) => 
{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.listen('3000', (req, res) => 
{
    console.log("Serving on port 3000");
})

// app.get('/makecampground', async (req, res) => 
// {
//     const camp = new Campground({title: 'My Backyard', description: 'Cheap camping'});
//     await camp.save();
//     res.send(camp);
// })