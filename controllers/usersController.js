const User = require('../models/User')
const bcrypt = require('bcryptjs')

module.exports = {
    async createUser(req, res){
        console.log('POST body: req.body');

        const newUser = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        }

        try{
            const password = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, password)
            const user = await newUser.save();
            res.status(200).json(user);
        }catch(err){
            console.log(err);
        }

    }
}