const express = require('express');
const router = express.Router();

// import validators

//import controllers
const { create, list, read, update, remove } = require('../controllers/blog');

// import middlewares
const { requireSignin, authMiddleware} = require('../controllers/auth');

router.post('/blogs', requireSignin, authMiddleware, create);
router.get('/blogs', list);
router.get('/blogs/:id', read);
router.put('/blogs/:id', update);
router.delete('/blogs/:id', remove);

module.exports = router;