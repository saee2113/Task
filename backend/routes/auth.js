const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth.js'); // Import middleware

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', auth, authController.getMe); // Protected route

module.exports = router;
