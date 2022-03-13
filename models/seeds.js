const mongoose = require('mongoose')
const User = require('/User')

mongoose.connect('mongodb://127.0.0.1/SNS')

const db = mongoose.connection;

db.on('error', (err) => {
    console.log('Connection error', err);
})

// db.once('open', async () => {
//     console.log('Connected');

//     await User.deleteMany()

//     try {

//     }
// })