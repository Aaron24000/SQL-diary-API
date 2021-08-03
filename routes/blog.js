const express = require('express');
const router = express.Router();

// import validators

//import controllers
const { create } = require('../controllers/blog');

// import middlewares
const { requireSignin, authMiddleware} = require('../controllers/auth');

router.post('/blogs', requireSignin, authMiddleware, create);

module.exports = router;