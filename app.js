// const mongo = require('./config/mongo')
require('dotenv').config()
const routes = require('./routes')
const express = require('express')
const mongoose = require('mongoose');
const app = express()
const PORT = process.env.PORT ||3000

//mongoo connection
// mongoose.connect('mongodb://127.0.0.1:27017/DaisiAppDB', { useNewUrlParser: true });

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use('/', routes)

app.listen(PORT , () => {
  console.log(`listening to port ${PORT}`)
})
