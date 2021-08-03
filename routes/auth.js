const express = require('express');
const router = express.Router();

// import validators

//import from controllers
const { register, login, forgotPassword, resetPassword } = require('../controllers/auth');

router.post('/register', register);
router.post('/login', login);
router.put('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);

module.exports = router;