const express = require('express');
const router = express.Router();

const driverController = require('../controllers/driverController');

router.post('/', driverController.onboardDriver)
router.get('/active-manifest', driverController.driverManifest)
router.put('/transfer-cargo', driverController.transferCargo)

module.exports = router