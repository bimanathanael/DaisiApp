const router = require('express').Router()
const ProfileControllers = require('../controllers/ProfileControllers')

// router.get('/', (req, res) => {
//   return res.status(200).json({msg: "Hello and Welcome"})
// })
// router.get('/profile', ProfileControllers.allProfile)
// router.get('/profile/byTags', ProfileControllers.allTagProf)
// router.get('/profile/:phone', ProfileControllers.profByPhone)

//token asal untuk new user
//wajib untuk existing user
router.post('/profile/:token', ProfileControllers.updateProf)
// router.delete('/profile/:phone', ProfileControllers.deleteProf)

module.exports =  router

