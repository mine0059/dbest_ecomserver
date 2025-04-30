const express = require('express');
const router = express.Router();
const {register, login, verifyToken} = require('../controllers/auth.controller');
const {body} = require('express-validator');

const validateUser = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Email is required'),
    body('password')
    .isLength({min: 8}).withMessage('Password must be at least 8 characters long')
    .isStrongPassword().withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('phone').isMobilePhone('any').withMessage('Please provide a valid phone number'),
]

router.post('/login', login);
router.post('/register', validateUser, register);
router.get('/verify-token', verifyToken);
// router.post('/forgot-password', signup);
// router.post('/verify-otp', signup);
// router.post('/reset-password', signin);

module.exports = router;