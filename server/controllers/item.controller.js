const Item = require('../models/item.model');
const Notification = require('../models/notification.model');
const { validationResult } = require('express-validator');

// Create a new item report
exports.createItem = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { category, description, date, location, type, photoUrl, contactInfo, notes } = req.body;

        const newItem = new Item({
            category,
            description,
            date,
            location,
            type,
            reportedBy: req.user.userId,
            photoUrl,
            contactInfo,
            notes
        });

        await newItem.save();

        res.status(201).json({ message: 'Item reported successfully', item: newItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all items
exports.getAllItems = async (req, res) => {
    try {
        const { type, category, status, search } = req.query;
        const query = {};

        // Apply filters if provided
        if (type) query.type = type;
        if (category) query.category = category;
        if (status) query.status = status;

        // Apply text search if provided
        if (search) {
            query.$text = { $search: search };
        }

        const items = await Item.find(query)
            .populate('reportedBy', 'firstName lastName universityId')
            .sort({ createdAt: -1 });

        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get items for a specific user
exports.getUserItems = async (req, res) => {
    try {
        const items = await Item.find({ reportedBy: req.user.userId })
            .sort({ createdAt: -1 });

        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get item by ID
exports.getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id)
            .populate('reportedBy', 'firstName lastName universityId')
            .populate('claimedBy', 'firstName lastName universityId');

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update an item
exports.updateItem = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { category, description, date, location, status, photoUrl, contactInfo, notes } = req.body;

        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Check if user is the owner or an admin
        if (item.reportedBy.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this item' });
        }

        // Update item fields if provided
        if (category) item.category = category;
        if (description) item.description = description;
        if (date) item.date = date;
        if (location) item.location = location;
        if (status) item.status = status;
        if (photoUrl) item.photoUrl = photoUrl;
        if (contactInfo) item.contactInfo = contactInfo;
        if (notes) item.notes = notes;

        await item.save();

        res.json({ message: 'Item updated successfully', item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete an item
exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Check if user is the owner or an admin
        if (item.reportedBy.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this item' });
        }

        await item.deleteOne();

        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Claim an item
exports.claimItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (item.status !== 'available') {
            return res.status(400).json({ message: 'Item not available for claim' });
        }

        // Update item status to pending
        item.status = 'pending';
        item.claimedBy = req.user.userId;

        await item.save();

        // Create notification for the item owner
        const newNotification = new Notification({
            user: item.reportedBy,
            type: 'info',
            title: 'Item Claim Request',
            message: `Someone has requested to claim your ${item.type === 'lost' ? 'found' : 'lost'} item: ${item.description}.`,
            relatedItem: item._id
        });

        await newNotification.save();

        res.json({ message: 'Claim request submitted successfully', item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Approve or reject a claim
exports.processClaim = async (req, res) => {
    try {
        const { approve } = req.body;
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Check if user is the owner or an admin
        if (item.reportedBy.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to process this claim' });
        }

        if (item.status !== 'pending') {
            return res.status(400).json({ message: 'This item is not pending approval' });
        }

        // Update item status based on decision
        item.status = approve ? 'claimed' : 'available';

        // If rejected, reset claimedBy field
        if (!approve) {
            item.claimedBy = null;
        }

        await item.save();

        // Create notification for the claimant
        const newNotification = new Notification({
            user: item.claimedBy,
            type: approve ? 'success' : 'warning',
            title: approve ? 'Claim Approved' : 'Claim Rejected',
            message: approve
                ? `Your claim for "${item.description}" has been approved. Please visit the lost and found office to collect your item.`
                : `Your claim for "${item.description}" has been rejected.`,
            relatedItem: item._id
        });

        await newNotification.save();

        res.json({
            message: approve ? 'Claim approved successfully' : 'Claim rejected successfully',
            item
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};