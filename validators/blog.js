const { check } = require('express-validator');

exports.messageCreateValidator = [
    check('imageUrl').notEmpty().withMessage('An image address is required!'),
    check('title').not().isEmpty().isLength({ max: 70 }).withMessage('A title is required!'),
    check('body').not().isEmpty().isLength({ min: 20, max: 2000 }).withMessage('Message must be between 20 and 2000 characters long!')
]

exports.messageUpdateValidator = [
    check('imageUrl').notEmpty().withMessage('An image address is required!'),
    check('title').not().isEmpty().isLength({ max: 70 }).withMessage('A title is required!'),
    check('body').not().isEmpty().isLength({ min: 20, max: 2000 }).withMessage('Message must be between 20 and 2000 characters long!')
]