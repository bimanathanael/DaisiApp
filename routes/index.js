const router = require('express').Router()
const ProfileControllers = require('../controllers/ProfileControllers')

router.get('/profile', ProfileControllers.allProfile)
router.get('/profile/byTags', ProfileControllers.allTagProf)
router.get('/profile/:phone', ProfileControllers.profByPhone)
router.put('/profile/:phone', ProfileControllers.updateProf)
router.delete('/profile/:phone', ProfileControllers.deleteProf)

module.exports =  router

