const express = require('express');
const router = express.Router()

const maintenanceController = require('../controllers/maintenanceController')
const protect = require('../middleware/authMiddleware')

router.post('/', protect, maintenanceController.newLog);

module.exports = router