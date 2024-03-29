const express = require('express')
const app = express()
const PORT = process.env.PORT || 8000;
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv').config()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwtAuthenticate = require('express-jwt')

const checkAuth = () => {
    return jwtAuthenticate({
        secret: SERVER_SECRET_KEY, // check the token hasn't been tampered with 
        algorithms: ["HS256"],
        requestProperty: 'auth'
    }) // jwtAuthenticate
} //checkAuth()


const SERVER_SECRET_KEY = 'yourSecretKeyHereCHICKEN'

const usersController = require('./controllers/usersController')

app.use( cors() )
app.use( express.json() )
app.use( express.urlencoded({ extended: true }) )

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
})

const User = require('./models/User')
const Post = require('./models/Post')

mongoose.connect(process.env.MONGO_URI)

const db = mongoose.connection;

db.on('error', (err) => {
    console.log('Connection error', err);
    process.exit(1)
})

app.post('/search', (req, res) => {
  let userName = new RegExp("^" + req.body.query)
  User.find({username: {$regex:userName}})
  .select("_id username")
  .then(user=> {
    res.json({user})
  }).catch(err => {
    console.log('search ',err);
  })
})


app.post('/register', usersController.createUser)
app.post('/login', usersController.loginUser)


// All routes beyond this point require authentication
app.use( checkAuth() )

app.use( async (req, res, next) => {
    try{
        const user = await User.findOne({ _id: req.auth._id })

        if (user === null){
            res.sendStatus(401)
        } else {

            req.user = user
            next(); // move on to next handler
        }
    }catch( err ){

    }
})

app.get("/timeline", async (req, res) => {
  // console.log('req.user.posts', req.user.posts);
  try {
    await req.user.populate({
      path: "posts",
      populate: [
        {
          path: 'user',
          select: { 'passwordDigest': 0 },  
        },
        { path: 'comments.user' }
      ]
    })
    res.json(req.user.posts);

    // console.log('comments', req.user.posts.map(p => p.comments));
  } catch (err) {
    res.status(500).json(err);
    console.log('500 err', err);
  }
});

  app.get("/users", async (req, res) => {
      console.log('req',req);
      try{
        const users = await User.findOne({userId: req.user._id})
        console.log('req.body.params',req.user._id);
        res.json(users);
        console.log('users', users);
      }catch(err){
        res.status(500).json(err)
        console.log('profile error', err);
      }
  })

  app.get("/user/details", async (req, res) => {
    try{

      await req.user
      res.json(req.user);

    //  console.log('req.user', req.user);
    }catch(err){
      res.status(500).json(err)
      console.log('profile error', err);
    }
})

app.post("/create/posts", async (req, res) => {
  try{
    const { content } = req.body

    const newPost = await Post.create({content: req.body.content, img: req.body.img})
    await req.user.savePost(newPost)
    const postWithUser = await newPost.populate('user');
    // console.log('postWIthUser',postWithUser);
    res.json( postWithUser )

  }catch(err){
    console.log('post err', err);
  }
    
})

app.put("/likes", async (req, res) => {
  try{
    const newLike = await Post.findById(req.body.postId)
    
      if(!newLike.likes.includes(req.user._id)){
       
        await newLike.update({$push: {likes: req.user._id}})
        return res.json(newLike)
      }else{
        await newLike.update({ $pull: { likes: req.user._id } })
        return res.json(newLike)
      }

  }catch(err){
    console.log('likes error', err);
  }
})

app.post("/comment", async (req, res) => {
  try{
 
    const updatedPost = await Post.findOneAndUpdate({_id: req.body.postId}, {
      $push: {
          comments: {
            body: req.body.comment,
            user: req.user._id
          }
      }
    }, {
      new: true
    })
    const postsCommentUsers = await updatedPost.populate('comments.user')
    const lastComment = postsCommentUsers.comments.pop()
    res.json(lastComment)
   g('newpostupdate', newPost);  
  

  }catch(err){
    console.log('post err', err);
  }
    
})







