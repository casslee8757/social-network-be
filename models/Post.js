const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({

    content: String,
    userId: String,
    img: String,

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // comments belongs to a user

    },

    creatdAt: {
        type: Date,
        default: Date.now //automatically default thi field to the current date
    },

    comment: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
            
        }
    ]
},
    {timestamps: true}
)



module.exports = mongoose.model('Post', PostSchema)
