const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const checkAuth = () => {
    return jwtAuthenticate({
        secret: SERVER_SECRET_KEY, // check the token hasn't been tampered with 
        algorithms: ["HS256"],
        requestProperty: 'auth'
    }) // jwtAuthenticate
} //checkAuth()


const SERVER_SECRET_KEY = 'yourSecretKeyHereCHICKEN'


module.exports = {
    async createUser(req, res){

        console.log('POST body: req.body');
        console.log(req.body) 
        const { username, email, passwordDigest} = req.body;

        User.findOne({email:email},(err,user)=>{
            if(user){
                res.send({message:"user already exist"})
            }else {
                const user = new User({username,email,passwordDigest})
                user.save( err => {

                    if( err ){
                        res.send(err)
                    }else{
                        bcrypt.genSalt(10, function(err, salt){
                            bcrypt.hash(passwordDigest, salt, function(err, hash){

                                if(err) throw err;
                                user.passwordDigest = hash;
                                user.save()
                                    .then(response => {
                                        res.status(200).json({
                                            success: true,
                                            result: response
                                        })
                                    })
                                    .catch(err => {
                                        res.status(500).json({
                                            errors: [{error: err  }]
                                        })
                                    })
                            })//bcrypt.hash
                        }) //bcrypt.genSalt
                    } // if(err) else 
                }) //user.save
 
            } // if(user) else
            
        })//findOne()

    }, // createuser()


    async loginUser(req, res){

            console.log('POST /login', req.body);
            const { email, password } = req.body;
            console.log('email,password', email, password);
        
            try {
                const user = await User.findOne({ email })
                console.log('user', user);
        
                
                if ( user && bcrypt.compareSync(password, user.passwordDigest) ){
                // console.log('user', user);
        
                    const token = jwt.sign(
                        { _id: user._id },
                        SERVER_SECRET_KEY,
                        { expiresIn: '72h' }
                    ); // jwt.sign()
        
                    const filteredUser = {
                        username: user.username,
                        email: user.email,
                    }
                    res.json({ token, user: filteredUser }) // send token as JSON response
        
                } else {
                    console.log('token', password);
                    res.sendStatus( 401 ) // Unauthorized 
                }
        
            } catch( err ){
                console.log('Error querying User', err);
                res.sendStatus( 500 );
            }
        
    } // loginUser()
}// module export 