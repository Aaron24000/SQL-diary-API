const express = require('express');
const router = express.Router();

// import validators
const {resetPasswordValidator, userLoginValidator, userRegisterValidator, forgotPasswordValidator} = require('../validators/auth');
const { runValidation } = require('../validators/index');

//import from controllers
const { register, login, forgotPassword, resetPassword } = require('../controllers/auth');

router.post('/register', userRegisterValidator, runValidation, register);
router.post('/login', userLoginValidator, runValidation, login);
router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword);
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword);

module.exports = router;