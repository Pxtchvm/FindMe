const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
    '/register',
    [
        check('universityId', 'University ID is required').notEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
        check('firstName', 'First name is required').notEmpty(),
        check('lastName', 'Last name is required').notEmpty(),
        check('role', 'Role must be student, staff, or admin').isIn(['student', 'staff', 'admin'])
    ],
    authController.register
);

// @route   POST api/auth/login
// @desc    Login user and get token
// @access  Public
router.post(
    '/login',
    [
        check('universityId', 'University ID is required').notEmpty(),
        check('password', 'Password is required').exists()
    ],
    authController.login
);

module.exports = router;