const express = require('express');
const router = express.Router();

const parcelController = require('../controllers/parcelController');
const protect = require('../middleware/authMiddleware');;

router.post('/', protect, parcelController.logParcel);
router.put('/:id/dispatch', protect, parcelController.assignParcel)

module.exports = router