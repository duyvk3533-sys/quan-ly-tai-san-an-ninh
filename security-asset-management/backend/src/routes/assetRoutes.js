const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');

router.get('/', assetController.getAllAssets);
// Thêm các route khác (POST, PUT, DELETE) tại đây

module.exports = router;
