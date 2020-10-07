const Profile = require('../models/Profile')
const mongoose = require('mongoose')

class ProfileControllers {
  static allProfile( req, res ) {
    Profile
      .find()
      .then(doc => {
        return res.status(200).json(doc)
      })
      .catch( err => {
        return res.status(500).json({errMsg: err})
      })
  }

  static allTagProf( req, res ) {
    Profile
      .find()
      .then( doc => {
        let resultAll = []
        doc.forEach(oneDoc => {
          let allTrue = oneDoc.channels.filter(channel => channel.selected == true)
          allTrue.forEach(oneTag => {
            resultAll.push({
              _id: oneDoc._id,
              phone: oneDoc.phone,
              sender: oneDoc.sender,
              tag: oneTag,
            })
          })
        });
        return res.status(200).json(resultAll)
      })
      .catch( err => {
        return res.status(500).json({errMsg: err})
      })
  }

  static profByPhone( req, res ) {
    const phone = req.params.phone
    Profile
      .find({phone})
      .then( doc => {
        if(doc == null){
          return res.status(404).json({errMsg: "data not found"})
        }
        return res.status(200).json(doc)
      })
      .catch( err => {
        return res.status(500).json({errMsg: err})
      })
  }

  static updateProf( req, res) {
    if(!req.body.phone|| !req.body.sender || !req.body.message ){
      return res.status(400).json({errMsg: "Needed inputs: phone, sender, and message"})
    }
    
    let regex = new RegExp('Hi IES! Please send this message to activate the reminder for ([^/s]+) at ([^/s]+) (AM|PM)')
    if(!regex.test(req.body.message)){
      return res.status(400).json({errMsg: "Wrong format message"})
    }

    let match = regex.exec(req.body.message)

    const newData = {
      phone: req.body.phone,
      sender: req.body.sender,
    }

    Profile.findOneAndUpdate({ phone: req.body.phone}, 
      {
        $set: {
          phone: newData.phone,
          sender: newData.sender,
        },
        $addToSet: {
          channels: {
            name: match[1],
            time: `${match[2]} ${match[3]}`,
            selected: true
          },
        },
      }, {
        upsert: true,
        new: true,
      })
      .then( doc => {
        res.status(200).json(doc)
      })
      .catch( err => {
        return res.status(500).json({errMsg: err})
      })     
  }

  static deleteProf( req, res){
    const phone = req.params.phone
    Profile.deleteOne({ phone: phone})
      .exec()
      .then(doc => {
        res.status(200).json(doc)
      })
      .catch( err => {
        return res.status(500).json({errMsg: err})
      })
  }
}

module.exports =  ProfileControllers