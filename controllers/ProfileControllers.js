const Profile = require('../models/Profile')
// const mongoose = require('mongoose')
const axios = require('axios');

class ProfileControllers {

  static hello (req, res) {
    return res.status(200).json({msg: "Hello and Welcome"})
  }

  // static allProfile( req, res ) {
  //   Profile
  //     .find()
  //     .then(doc => {
  //       return res.status(200).json(doc)
  //     })
  //     .catch( err => {
  //       return res.status(500).json({errMsg: err})
  //     })
  // }

  // static allTagProf( req, res ) {
  //   Profile
  //     .find()
  //     .then( doc => {
  //       let resultAll = []
  //       doc.forEach(oneDoc => {
  //         let allTrue = oneDoc.channels.filter(channel => channel.selected == true)
  //         allTrue.forEach(oneTag => {
  //           resultAll.push({
  //             _id: oneDoc._id,
  //             phone: oneDoc.phone,
  //             sender: oneDoc.sender,
  //             tag: oneTag,
  //           })
  //         })
  //       });
  //       return res.status(200).json(resultAll)
  //     })
  //     .catch( err => {
  //       return res.status(500).json({errMsg: err})
  //     })
  // }

  // static profByPhone( req, res ) {
  //   const phone = req.params.phone
  //   Profile
  //     .find({phone})
  //     .then( doc => {
  //       if(doc == null){
  //         return res.status(404).json({errMsg: "data not found"})
  //       }
  //       return res.status(200).json(doc)
  //     })
  //     .catch( err => {
  //       return res.status(500).json({errMsg: err})
  //     })
  // }

  static updateProf( req, res) {
    let regex = new RegExp('Hi IES! Please send this message to activate the reminder for ([^/s]+) at ([^/s]+) (AM|PM)')
    if(!regex.test(req.body.message)){
      return res.status(400).json({errMsg: "Wrong format message"})
    }

    let match = regex.exec(req.body.message)

    const newData = {
      phone: req.body.phone,
      sender: req.body.sender,
      email: req.body.email,
    }

    let userSelection = []
    let currentServices = [
      {
        name: 'Saturday Service',
        time: '05:00 PM',
      },
      {
        name: 'our Facebook Live Saturday Service',
        time: '07:00 PM',
      },
      {
        name: 'Sunday Service',
        time: '09:30 AM',
      },
      {
        name: 'Sunday Service',
        time: '11:15 AM',
      },
      {
        name: 'our YouTube Premiere on Sunday',
        time: '01:00 PM',
      }
    ]


    // using regex match to check with currentService 
    currentServices.forEach(service => {
      if(service.name == match[1] && service.time == `${match[2]} ${match[3]}`){
        userSelection.push({
          label: service.name,
          value: service.name + " " +  service.time,
          selected: true
        })
      }
    })

    // Profile.findOneAndUpdate({ phone: req.body.phone}, 
    //   {
    //     $set: {
    //       phone: newData.phone,
    //       sender: newData.sender,
    //       email: newData.email,
    //     },
    //     //set = menambah di array service hanyak ketika datanya berbeda dari yang sudah ada
    //     // kalau data barunya sudah ada, tidak ter input
    //     $addToSet: {
    //       services: userSelection,
    //     },
    //   }, {
    //     upsert: true,
    //     // new untuk menampilkan data baru yang di-input
    //     // new: true, 
    //   })
    //   .then( doc => {
      axios.get(`https://api2.kadokard.com/api/v1/p/${req.params.token}`)
      .then( doc => {
        //false == data profile not found
        if(doc.data.ok === false){
          axios.post('https://api2.kadokard.com/api/v1/contact',
          [
            {
              "firstName": newData.sender,
              "lastName": newData.sender,
              "phone": newData.phone,
              "notes": "Penambahan dari Onboarding",
              "tags": "All",
              "company": "IES"
            }
          ],
          {
            // fix tokenjwt da479fdcd3335c1db4689edc2308208a1661d636a36bd21956bf5034eb7635
            headers: {
              token: "da479fdcd3335c1db4689edc2308208a1661d636a36bd21956bf5034eb7635"
            }
          })
          .then( respUploadContact => {
            return axios.post('https://api2.kadokard.com/api/v1/profile',
            {
              "phone": newData.phone,
              "company": "IES",
              "dealer": "IES",
              "email": "youremail@mail.com",
              "name": "yourname",
              "channels": userSelection
            },
            {
              headers: {
                token: "da479fdcd3335c1db4689edc2308208a1661d636a36bd21956bf5034eb7635"
              }
            })
          .then( respNewProfile => {
            return axios.get(`https://api2.kadokard.com/api/v1/p/${respNewProfile.data.profile.pId}`)
          .then( respGetProfile => {
            return res.status(200).json({data: respGetProfile.data})
          })
          })
          })
          .catch( err => {
            return res.status(500).json({errMsg: err})
          }) 
        } else {
          axios.post(`https://api2.kadokard.com/api/v1/p/${req.params.token}`, {
            "email": newData.email,
            "name": newData.sender,
            "channels": userSelection
          })
          .then( respPost => {
            return res.status(200).json({data: respPost.data})
          })
          .catch( err => {
            return res.status(500).json({errMsg: err})
          }) 
        }     
      })
      .catch( err => {
        res.status(500).json({err: err})
      })    
  }

  // static deleteProf( req, res){
  //   const phone = req.params.phone
  //   Profile.deleteOne({ phone: phone})
  //     .exec()
  //     .then(doc => {
  //       res.status(200).json(doc)
  //     })
  //     .catch( err => {
  //       return res.status(500).json({errMsg: err})
  //     })
  // }
}

module.exports =  ProfileControllers