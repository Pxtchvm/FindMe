const express = require('express');
const { check } = require('express-validator');
const itemController = require('../controllers/item.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

// @route   POST api/items
// @desc    Create a new item report
// @access  Private
router.post(
    '/',
    [
        auth,
        check('category', 'Category is required').notEmpty(),
        check('description', 'Description is required').notEmpty(),
        check('date', 'Date is required').notEmpty(),
        check('location', 'Location is required').notEmpty(),
        check('type', 'Type must be lost or found').isIn(['lost', 'found'])
    ],
    itemController.createItem
);

// @route   GET api/items
// @desc    Get all items
// @access  Public
router.get('/', itemController.getAllItems);

// @route   GET api/items/user
// @desc    Get items for logged in user
// @access  Private
router.get('/user', auth, itemController.getUserItems);

// @route   GET api/items/:id
// @desc    Get item by ID
// @access  Public
router.get('/:id', itemController.getItemById);

// @route   PUT api/items/:id
// @desc    Update an item
// @access  Private
router.put(
    '/:id',
    [
        auth,
        check('category', 'Category must be valid').optional(),
        check('description', 'Description must be valid').optional().notEmpty(),
        check('date', 'Date must be valid').optional().isDate(),
        check('location', 'Location must be valid').optional().notEmpty(),
        check('status', 'Status must be valid').optional().isIn(['available', 'claimed', 'pending'])
    ],
    itemController.updateItem
);

// @route   DELETE api/items/:id
// @desc    Delete an item
// @access  Private
router.delete('/:id', auth, itemController.deleteItem);

// @route   POST api/items/:id/claim
// @desc    Claim an item
// @access  Private
router.post('/:id/claim', auth, itemController.claimItem);

// @route   PUT api/items/:id/process-claim
// @desc    Approve or reject a claim
// @access  Private
router.put(
    '/:id/process-claim',
    [
        auth,
        check('approve', 'Approve field is required').isBoolean()
    ],
    itemController.processClaim
);

module.exports = router;