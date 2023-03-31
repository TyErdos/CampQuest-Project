const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({

    email: 
    {
        type: String,
        required: true
    }
});

UserSchema.plugin(passportLocalMongoose); //passportlocalmongoose adds in a password and username by default, which is why it's not in the schema

module.exports = mongoose.model('User', UserSchema);
