
require('dotenv').config()
const routes = require('./routes')
const express = require('express')
const app = express()
const port = process.env.PORT ||3000

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use('/', routes)

app.listen(port , () => {
  console.log(`listening to port ${port}`)
})
