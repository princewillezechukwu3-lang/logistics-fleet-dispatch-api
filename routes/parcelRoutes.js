const express = require('express');
const router = express.Router();

const parcelController = require('../controllers/parcelController');

router.post('/', parcelController.logParcel);
router.put('/:id/dispatch', parcelController.assignParcel)

module.exports = router