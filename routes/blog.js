const express = require('express');
const router = express.Router();

// import validators
const { messageCreateValidator, messageUpdateValidator} = require('../validators/blog');
const { runValidation } = require('../validators/index');

//import controllers
const { create, list, read, update, remove } = require('../controllers/blog');

// import middlewares
const { requireSignin, authMiddleware} = require('../controllers/auth');

router.post('/blogs', requireSignin, authMiddleware, create);
router.get('/blogs', list);
router.get('/blogs/:id', read);
router.put('/blogs/:id', messageUpdateValidator, runValidation, requireSignin, authMiddleware, update);
router.delete('/blogs/:id', requireSignin, authMiddleware, remove);

module.exports = router;