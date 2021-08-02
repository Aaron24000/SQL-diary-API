const express = require('express');
const router = express.Router();

// import validators

//import from controllers
const { register, login } = require('../controllers/auth');

router.post('/register', register);
router.post('/login', login);

module.exports = router;