const express = require('express');
const router = express.Router()

const maintenanceController = require('../controllers/maintenanceController')

router.post('/', maintenanceController.newLog);

module.exports = router