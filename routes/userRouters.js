const express = require('express')
const router = express.Router()
const userControllers = require('../controllers/userControllers')
const authenticateToken = require('../middlewares/tokenAuthenticate')

router.post('/sign-up', userControllers.signUp)

router.post('/login', userControllers.login)

router.get('/get-user', authenticateToken, userControllers.getUser)

router.get('/all-users', authenticateToken, userControllers.getAllUsers)

module.exports = router

