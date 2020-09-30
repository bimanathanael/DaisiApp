const mongoose = require('mongoose')

const profileSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  phone: String,
  email: String,
  name: String,
  channels: Array,
})

module.exports = mongoose.model('Profile', profileSchema)