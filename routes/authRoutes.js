const express = require('express');
const router = express.Router()

const authController = require('../controllers/authController')

router.post('/signup', authController.registerDispatcher)
router.post('/login', authController.loginDispatcher)

module.exports = router