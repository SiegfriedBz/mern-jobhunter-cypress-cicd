const express = require('express')
const { authController } = require('../controllers')
const {
    registerUser,
    loginUser,
    updateUser
} = authController
const {
    authenticateMiddleWare,
} = require('../middleware')

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.patch('/', authenticateMiddleWare, updateUser)

module.exports = router
