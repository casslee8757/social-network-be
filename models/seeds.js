const mongoose = require('mongoose')
const User = require('./User')
const bcrypt = require('bcrypt'); 
const Post = require('./Post');
const dotenv = require('dotenv').config()


mongoose.connect(process.env.MONGO_URI)

const db = mongoose.connection;

db.on('error', (err) => {
    console.log('Connection error', err);
})

db.once('open', async () => {
    console.log('Connected');

    await User.deleteMany()

    try {

        const users = await createUsers()
        const posts = await createPosts()
        console.log('post and users', posts, users);
        await users[0].savePost(posts[0])
        await users[0].savePost(posts[1])
        // users[0].posts.push(posts[1]._id)
        // await users[0].save()
        console.log('firstuser', await users[0].populate('posts'));

        // posts[1].user = users[0]._id
        // await posts[0].save()
        console.log('firstpost', await posts[0].populate('user'));


    } catch ( err ){
        console.log('Error creating account:', err);
        db.close()
        process.exit(1)
    }
    process.exit(0)
});

const createUsers = async() => {
    
    await User.deleteMany()
    
    const results = await User.create([
        {
            username: 'casslee',
            email: 'casslee@ga.co',
            passwordDigest: bcrypt.hashSync('chicken', 10),
            profilePicture: 'https://www.lempertz.com/lempertz_api/images/1110-457-Henri-Matisse-Nadia-au-sourir.jpg'
            
        },
        {
            username: 'David Hockney',
            email: 'hockney@ga.co',
            passwordDigest: bcrypt.hashSync('chicken', 10),
             
        },
    ]);

    return results
  

}

const createPosts = async() => {
    await Post.deleteMany()

    const posts = await Post.create([
        {
            content: "Lorem ipsum dolor sit amet",
            img: "https://images.squarespace-cdn.com/content/v1/5702ab9d746fb9634796c9f9/1513371328617-KCU3YM6TL3AW3VGQQR4G/10.+Pool+and+Steps%2C+Le+Nid+du+Duc_71A22.jpg"
        },
        {
            content: "consectetur adipiscing elit, sed do eiusmod tempor incididunt",
            img: "http://www.metmuseum.org/-/media/images/exhibitions/2017/david-hockney/davidhockney_landingpage_listview_480x480_071217_vx.jpg?sc_lang=en"
        }

    ])
    return posts
}



