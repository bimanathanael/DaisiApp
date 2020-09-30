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
              email: oneDoc.email,
              name: oneDoc.name,
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
    if(!req.body.phone || !req.body.email || !req.body.name || !req.body.keyword ){
      return res.status(400).json({errMsg: "Needed inputs: phone, email, name, and keyword"})
    }
    
    let regex = new RegExp('Hi IES! Please send this message to activate the reminder for ([^/s]+) at ([^/s]+) (AM|PM)')
    if(!regex.test(req.body.keyword)){
      return res.status(400).json({errMsg: "Wrong format Keyword"})
    }

    let match = regex.exec(req.body.keyword)

    const phone = req.params.phone
    const newData = {
      phone: req.body.phone,
      email: req.body.email,
      name: req.body.name,
    }
    
    // Profile.updateOne({ phone: phone}, 
    //   {
    //     $set: {
    //       phone: newData.phone,
    //       email: newData.email,
    //       name: newData.name,
    //       channels: userSelection,
    //     }
    //   }, {upsert: true})
    //   .then( doc => {
    //     res.status(200).json(doc)
    //   })
    //   .catch( err => {
    //     return res.status(500).json({errMsg: err})
    //   })

    Profile
      .findOne({phone: phone})
      .then( doc => {
        if(doc == null){
          let userSelection = []
          let currentServices = [
            {
              name: 'Saturday Service',
              time: '05:00 PM',
              selected: false
            },
            {
              name: 'our Facebook Live Saturday Service',
              time: '07:00 PM',
              selected: false
            },
            {
              name: 'Sunday Service',
              time: '09:30 AM',
              selected: false
            },
            {
              name: 'Sunday Service',
              time: '11:16 AM',
              selected: false
            },
            {
              name: 'our YouTube Premiere on Sunday',
              time: '01:00 PM',
              selected: false
            }
          ]

          currentServices.forEach(service => {
            if(service.name == match[1] && service.time == `${match[2]} ${match[3]}`){
              service.selected = true
            }
            userSelection.push(service)
          })

          const product = new Product({
            _id: new mongoose.Types.ObjectId(),
            phone: newData.phone,
            email: newData.email,
            name: newData.name,
            channels: userSelection,
          })
      
          product
            .save()
            .then(doc => {
              return res.status(200).json(doc)
            })
            .catch( err => {
              return res.status(500).json(err)
            })
        } else {
          let updatedSelection = []
          let userSelection = doc.channels

          userSelection.forEach(service => {
            if(service.name == match[1] && service.time == `${match[2]} ${match[3]}`){
              service.selected = true
            }
            updatedSelection.push(service)
          })

          Profile.updateOne({ phone: phone}, 
          {
            $set: {
              phone: newData.phone,
              email: newData.email,
              name: newData.name,
              channels: updatedSelection,
            }
          })
          .then( doc => {
            res.status(200).json(doc)
          })
          .catch( err => {
            return res.status(500).json({errMsg: err})
          })
        }
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