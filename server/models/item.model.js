const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: ['Electronics', 'Books', 'Clothing', 'Accessories', 'IDs', 'Others']
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'claimed', 'pending'],
        default: 'available'
    },
    type: {
        type: String,
        enum: ['lost', 'found'],
        required: true
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    claimedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    photoUrl: {
        type: String
    },
    contactInfo: {
        type: String
    },
    notes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add text index for searching
itemSchema.index({ description: 'text', location: 'text', category: 'text' });

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;