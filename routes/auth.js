const express = require('express');
const router = express.Router();

// import validators
const {resetPasswordValidator, userLoginValidator, userRegisterValidator, forgotPasswordValidator} = require('../validators/auth');

//import from controllers
const { register, login, forgotPassword, resetPassword } = require('../controllers/auth');

router.post('/register', register);
router.post('/login', login);
router.put('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);

module.exports = router;