const router = require('express').Router()
const ProfileControllers = require('../controllers/ProfileControllers')

router.get('/', ProfileControllers.hello)

router.post('/profile', ProfileControllers.createProf)

module.exports =  router

