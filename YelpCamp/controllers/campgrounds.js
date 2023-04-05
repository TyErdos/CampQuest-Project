const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');


module.exports.index = async (req, res) => 
{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}


module.exports.renderNewForm = (req, res) => 
{
    
    res.render('campgrounds/new');

}

module.exports.createCampground = async (req,res) => 
{
    // if(!req.body.Campground) throw new ExpressError('Invalid Campground Data', 400);

   
        const campground = new Campground(req.body.campground);
        campground.images = req.files.map(f => ({url: f.path, filename: f.filename})); // map over the array that has been added to req.files from multer. Take the path and the filename, make a new object for each one and add it to an array for each image added by the user
        campground.author = req.user._id;
        await campground.save();
        console.log(campground);
        req.flash('success', "Successfully created a new campground!");
        res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) =>
{
    const campground = await Campground.findById(req.params.id).populate({path:'reviews', populate: {path:'author'}}).populate('author');
    if(!campground)
    {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}

module.exports.renderEditForm = async (req, res) =>
{
    const {id} = req.params;
    const campground = await Campground.findById(id)
    if(!campground)
    {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}

module.exports.updateCampground = async (req, res) => 
{
    const {id} = req.params;
    console.log(req.body);
    const campground =  await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages)
    {

        for(let filename of req.body.deleteImages)
        {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}}); //pull from the images array, all images where the file name of the image is in the req.body.deleteImages array
        
    }
    
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => 
{
    const {id} = req.params;
    const campground = await Campground.findById(id)
    if(!campground.author.equals(req.user._id))
    {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Deleted Campground');
    res.redirect('/campgrounds');
}