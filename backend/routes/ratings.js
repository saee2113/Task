const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { auth } = require('../middleware/auth');

router.post('/', auth, ratingController.submitRating);

module.exports = router;