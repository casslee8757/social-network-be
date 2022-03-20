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
            profilePicture: 'https://www.lempertz.com/lempertz_api/images/1110-457-Henri-Matisse-Nadia-au-sourir.jpg',
            profileCover: 'https://www.moma.org/d/assets/W1siZiIsIjIwMTUvMTAvMjAvOXBxeDR1dG9mMF9tYXRpc3NlY3V0b3V0LmpwZyJdLFsicCIsImNvbnZlcnQiLCItcXVhbGl0eSA5MCAtcmVzaXplIDIwMDB4NjY3XiAtZ3Jhdml0eSBDZW50ZXIgLWNyb3AgMjAwMHg2NjcrMCswIl1d/matissecutout.jpg?sha=08f7376b7ca84d59'
            
        },
        {
            username: 'David Hockney',
            email: 'hockney@ga.co',
            passwordDigest: bcrypt.hashSync('chicken', 10),
            profilePicture: 'https://i.guim.co.uk/img/media/facaca99626f25f8cf881c1c65f75ea3e518dffe/0_0_2918_3500/master/2918.jpg?width=465&quality=45&auto=format&fit=max&dpr=2&s=872219f514e6fadeb877e08f080ae011',
            profileCover: 'https://www.theparisreview.org/blog/wp-content/uploads/2018/04/24hockney1-superjumbo.jpg'
             
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



