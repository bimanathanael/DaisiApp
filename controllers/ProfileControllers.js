const axios = require('axios');

class ProfileControllers {

  static hello (req, res) {
    return res.status(200).json({msg: "Hello and Welcome"})
  }


  static createProf( req, res) {
    let regex = new RegExp('Hi IES! Please send this message to activate the reminder for ([^/s]+) at ([^/s]+) (AM|PM)')
    if(!regex.test(req.body.message)){
      return res.status(400).json({errMsg: "Wrong format message"})
    }

    let match = regex.exec(req.body.message)

    const newData = {
      msgId: req.body.msgId,
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
      console.log("masuk atas")
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
    })
    .then( respNewProfile => {
      console.log("masuk 2", respNewProfile)

      return axios.get(`https://api2.kadokard.com/api/v1/p/${respNewProfile.data.profile.pId}`)
    })
    .then( respGetProfile => {
      console.log("masuk 3", respGetProfile.data)

      return res.status(200).json({data: respGetProfile.data})
    })
    .catch( err => {
      return res.status(500).json({errMsg: err})
    }) 
  }

}

module.exports =  ProfileControllers