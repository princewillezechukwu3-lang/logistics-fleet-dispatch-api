const express = require('express');
const router = express.Router();

const driverController = require('../controllers/driverController');
const protect = require('../middleware/authMiddleware')

router.post('/', driverController.onboardDriver)
router.get('/active-manifest', driverController.driverManifest)
router.put('/transfer-cargo', protect, driverController.transferCargo)

module.exports = router