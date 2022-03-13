const express = require('express')
const app = express()
const PORT = 8000;
const mongoose = require('mongoose')
const cors = require('cors')

app.use( cors() )
app.use( express.json() )

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
})

const User = require('./models/User')
const Post = require('./models/Post')

mongoose.connect(process.env.MONGO_URL, () => {
    console.log('Connected to MongoDB');
})

const db = mongoose.connection;

db.on('error', (err) => {
    console.log('Connection error', err);
    process.exit(1)
})