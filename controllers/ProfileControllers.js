const axios = require('axios');
const { response } = require('express');

class ProfileControllers {

  static hello (req, res) {
    return res.status(200).json({msg: "Hello and Welcome"})
  }


  static createProf( req, res) {
    const newData = {
      phone: req.body.phone,
      sender: req.body.sender,
      email: req.body.email,
    }

    let regex = new RegExp('Hi IES! Please send this message to activate the reminder for ([^/s]+) at ([^/s]+) (AM|PM)')
    if(!regex.test(req.body.message)){
      return res.status(400).json({errMsg: "Wrong format message"})
    }

    let match = regex.exec(req.body.message)

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

    axios.post('https://api2.kadokard.com/api/v1/wa',
      {
        "phone": newData.phone,
        "message": "Thankyou for sending the message! You will automatically receive updates from IES Whatsapp Service",
        "sender": "IES"
      },
      {
        headers: {
          token: "da479fdcd3335c1db4689edc2308208a1661d636a36bd21956bf5034eb7635"
        }
      })
      .then( success => {
        return axios.post('https://api2.kadokard.com/graphql',
        {
          "query":
            `query 
              waProfiles(
                $skip: Int, 
                $first: Int, 
                $filter: JSON, 
                $orderBy: String
              ) {    
                waProfiles(
                  skip: $skip, 
                  first: $first, 
                  filter: $filter, 
                  orderBy: $orderBy
                ) {        
                  pId       
                  phone        
                  name       
                  email        
                  company        
                  channels { label value selected }
                  createdAt
                  updatedAt
                }
              }`,
            "variables":{
              "filter":{
                "phone": `${newData.phone}`,
                "company":"IES"
              },
              "limit":1
            }
          },
        {
          // fix tokenjwt da479fdcd3335c1db4689edc2308208a1661d636a36bd21956bf5034eb7635
          headers: {
            token: "da479fdcd3335c1db4689edc2308208a1661d636a36bd21956bf5034eb7635"
          }
        })
      })
      .then( response => {

        let allData = response.data.data.waProfiles
        //means number already registered
        if(allData.length > 0){
          axios.post('https://api2.kadokard.com/api/v1/wa',
            {
              "phone": newData.phone,
              "message": `You can visit your IES Profile with this link https://account.daisi.id/profile/${allData[0].pId}`,
              "sender": "IES"
            },
            {
              headers: {
                token: "da479fdcd3335c1db4689edc2308208a1661d636a36bd21956bf5034eb7635"
              }
            }
          )
            .then( success => {
              return res.status(200).json({success: success.data})
            })
            .catch( err => {
              return res.status(500).json({errMsg: err})
            }) 
        } else {
          axios.post('https://api2.kadokard.com/api/v1/contact',
            [
              {
                "firstName": newData.phone,
                "lastName": newData.phone,
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
            return axios.post('https://api2.kadokard.com/api/v1/contact',
            [
              {
                "firstName": newData.phone,
                "lastName": newData.phone,
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
          })
          .then( respUploadContact => {
            return axios.post('https://api2.kadokard.com/api/v1/profile',
            {
              "phone": newData.phone,
              "company": "IES",
              "dealer": "IES",
              "email": "youremail@mail.com",
              "name": "IES",
              "channels": userSelection
            },
            {
              headers: {
                token: "da479fdcd3335c1db4689edc2308208a1661d636a36bd21956bf5034eb7635"
              }
            })
          })
          .then( respNewProfile => {
            let token = respNewProfile.data.profile.pId
            return axios.post('https://api2.kadokard.com/api/v1/wa',
            {
              "phone": newData.phone,
              "message": `You can visit your IES Profile with this link https://account.daisi.id/profile/${token}`,
              "sender": "IES"
            },
            {
              headers: {
                token: "da479fdcd3335c1db4689edc2308208a1661d636a36bd21956bf5034eb7635"
              }
          })
          .then( success => {
            return res.status(200).json({success: success.data})
          })
          .catch( err => {
            return res.status(500).json({errMsg: err})
          }) 
        })
      }
    })
    .catch( err => {
      return res.status(500).json({errMsg: err})
    }) 
  }
}
            // })

      //     axios.post('https://api2.kadokard.com/api/v1/contact',
      //     [
      //       {
      //         "firstName": newData.phone,
      //         "lastName": newData.phone,
      //         "phone": newData.phone,
      //         "notes": "Penambahan dari Onboarding",
      //         "tags": "All",
      //         "company": "IES"
      //       }
      //     ],
      //     {
      //       // fix tokenjwt da479fdcd3335c1db4689edc2308208a1661d636a36bd21956bf5034eb7635
      //       headers: {
      //         token: "da479fdcd3335c1db4689edc2308208a1661d636a36bd21956bf5034eb7635"
      //       }
      //     })
      //   }
      // })
      // .then( respUploadContact => {
      //   return axios.post('https://api2.kadokard.com/api/v1/contact',
      //   [
      //     {
      //       "firstName": newData.phone,
      //       "lastName": newData.phone,
      //       "phone": newData.phone,
      //       "notes": "Penambahan dari Onboarding",
      //       "tags": "All",
      //       "company": "IES"
      //     }
      //   ],
      //   {
      //     // fix tokenjwt da479fdcd3335c1db4689edc2308208a1661d636a36bd21956bf5034eb7635
      //     headers: {
      //       token: "da479fdcd3335c1db4689edc2308208a1661d636a36bd21956bf5034eb7635"
      //     }
      //   })
      // })
      // .then( respUploadContact => {
      //   return axios.post('https://api2.kadokard.com/api/v1/profile',
      //   {
      //     "phone": newData.phone,
      //     "company": "IES",
      //     "dealer": "IES",
      //     "email": "youremail@mail.com",
      //     "name": "IES",
      //     "channels": userSelection
      //   },
      //   {
      //     headers: {
      //       token: "da479fdcd3335c1db4689edc2308208a1661d636a36bd21956bf5034eb7635"
      //     }
      //   })
      // })
      // .then( respNewProfile => {
      //   let token = respNewProfile.data.profile.pId
      //   return axios.post('https://api2.kadokard.com/api/v1/wa',
      //   {
      //     "phone": newData.phone,
      //     "message": `You can visit your IES Profile with this link https://account.daisi.id/profile/${token}`,
      //     "sender": "IES"
      //   },
      //   {
      //     headers: {
      //       token: "da479fdcd3335c1db4689edc2308208a1661d636a36bd21956bf5034eb7635"
      //     }
      //   })
      //   .then( success => {
      //     return res.status(200).json({success: success})
      //   })
      //   .catch( err => {
      //     return res.status(500).json({errMsg: err})
      //   }) 
      


module.exports =  ProfileControllers