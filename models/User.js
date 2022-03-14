const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({

    username: {
        type: String,
        require: true,
        unique: true
    },

    email: {
        type: String,
        require: true,
        unique: true
    }, 

    password: {
        type: String,
        required: true
    },

    profilePicture: {
        type: String,
        default: "" // when created it's gonna be an empty image 
    },

    followers: {
        type: Array, // keeping user ids inside the array
        default: []
    },

    followings: {
        type: Array,
        default: []
    }


})

module.exports = mongoose.model('User', UserSchema)