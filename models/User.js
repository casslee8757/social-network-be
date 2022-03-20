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

    passwordDigest: {
        type: String,
        required: true
    },

    posts: [
        {
            ref: 'Post',
            type: mongoose.Schema.Types.ObjectId,

        }
    ],

    createdAt: {
        type: Date,
        default: Date.now //automatically default thi field to the current date
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
    },

    profileCover: {
        type: String,
        default: ""
    }
},
    {timestamps: true}
) 

UserSchema.methods.savePost = async function(post){
    this.posts.push(post._id)
    await this.save()

    post.user = this._id
    await post.save()
    console.log('associated post', post, this);
    return this;

}


module.exports = mongoose.model('User', UserSchema)