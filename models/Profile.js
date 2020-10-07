const mongoose = require('mongoose')

const profileSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  phone: String,
  sender: String,
  channels: Array,
})

module.exports = mongoose.model('Profile', profileSchema)