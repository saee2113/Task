const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { auth, restrictTo } = require('../middleware/auth');

router.get('/', storeController.getStores);
router.post('/', auth, restrictTo('admin'), storeController.createStore);

module.exports = router;