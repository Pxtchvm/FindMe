const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

// @route   GET api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, userController.getProfile);

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put(
    '/profile',
    [
        auth,
        check('firstName', 'First name is required').optional().notEmpty(),
        check('lastName', 'Last name is required').optional().notEmpty(),
        check('email', 'Please include a valid email').optional().isEmail(),
        check('mobileNumber', 'Mobile number is required').optional().notEmpty()
    ],
    userController.updateProfile
);

// @route   GET api/users/notifications
// @desc    Get user notifications
// @access  Private
router.get('/notifications', auth, userController.getNotifications);

// @route   PUT api/users/notifications/:id
// @desc    Mark notification as read
// @access  Private
router.put('/notifications/:id', auth, userController.markNotificationAsRead);

// @route   PUT api/users/notifications
// @desc    Mark all notifications as read
// @access  Private
router.put('/notifications', auth, userController.markAllNotificationsAsRead);

module.exports = router;