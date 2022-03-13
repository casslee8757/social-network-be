const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({

    body: String,
    username: String,
    comments: [
        {
            body: String,
            username: String,
        }
    ],

    likes: [
        {
            username: String
        }
    ],

   

})

module.exports = mongoose.model('Post', PostSchema)
