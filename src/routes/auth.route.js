const express = require('express');
const router = express.Router();
const {register, login, verifyToken, forgotPassword, verifyPasswordResetOTP, resetPassword} = require('../controllers/auth.controller');
const {body} = require('express-validator');

const validateUser = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Email is required'),
    body('password')
    .isLength({min: 8}).withMessage('Password must be at least 8 characters long')
    .isStrongPassword().withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('phone').isMobilePhone('any').withMessage('Please provide a valid phone number'),
]

const validatePassword = [
    body('newpassword')
    .isLength({min: 8}).withMessage('Password must be at least 8 characters long')
    .isStrongPassword().withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
];

router.post('/login', login);
router.post('/register', validateUser, register);
router.get('/verify-token', verifyToken);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyPasswordResetOTP);
router.post('/reset-password', validatePassword, resetPassword);

module.exports = router;