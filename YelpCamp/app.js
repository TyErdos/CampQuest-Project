const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ExpressError = require('./utilities/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');






const campgroundRoutes = require('./Routes/campgrounds');
const reviewRoutes = require('./Routes/reviews');
const userRoutes = require('./Routes/users');
const user = require('./models/user');




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
app.use(express.static(path.join(__dirname, 'Public')));

const sessionConfig = {
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //1000 milliseconds in a second, 60 secs in a minute, 60 mins in an hour, 24 hours in a day and 7 days in a week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}
app.use(session(sessionConfig)); //app.use session should be before app.use passport.session
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //use the localStrategy, and the authenticate on User

passport.serializeUser(User.serializeUser()); //tells passport how to serialize a user(how to store a user in the session)
passport.deserializeUser(User.deserializeUser());  //how to get a user out of that session

app.use((req, res, next) =>
{
    if(!['/login', '/register', '/'].includes(req.originalUrl))
    {
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);



app.get('/', (req, res) =>
{
    res.render('home')
})

app.all('*', (req, res, next) => 
{
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) =>
{
    const {statusCode=500} = err;
    if(!err.message) err.message = "Oh no, something went wrong!";
    res.status(statusCode).render('error', {err});
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