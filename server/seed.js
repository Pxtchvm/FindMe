/**
 * MongoDB Seed Script for FindMe App
 * 
 * This script populates the database with sample data for testing and development.
 * Run with: node seed.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/user.model');
const Item = require('./models/item.model');
const Notification = require('./models/notification.model');

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected for seeding'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Sample data
const sampleUsers = [
    {
        universityId: 'admin123',
        email: 'admin@example.com',
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        mobileNumber: '1234567890'
    },
    {
        universityId: 'student001',
        email: 'student@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'student',
        mobileNumber: '0987654321'
    },
    {
        universityId: 'staff001',
        email: 'staff@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'staff',
        mobileNumber: '5556667777'
    }
];

// Sample items (to be populated after users are created)
let sampleItems = [];

// Sample notifications (to be populated after users and items are created)
let sampleNotifications = [];

// Clear existing data
const clearDatabase = async () => {
    try {
        await User.deleteMany({});
        await Item.deleteMany({});
        await Notification.deleteMany({});
        console.log('Database cleared');
    } catch (error) {
        console.error('Error clearing database:', error);
        process.exit(1);
    }
};

// Seed users
const seedUsers = async () => {
    try {
        const createdUsers = [];

        for (const user of sampleUsers) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);

            const newUser = new User({
                ...user,
                password: hashedPassword
            });

            const savedUser = await newUser.save();
            createdUsers.push(savedUser);
        }

        console.log(`${createdUsers.length} users created`);
        return createdUsers;
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};

// Seed items
const seedItems = async (users) => {
    try {
        // Create sample items data with user references
        sampleItems = [
            {
                category: 'Electronics',
                description: 'Black HP laptop with blue case',
                date: new Date('2025-02-15'),
                location: 'Library, 2nd Floor',
                status: 'available',
                type: 'found',
                reportedBy: users[1]._id, // Student user
                photoUrl: 'https://example.com/laptop.jpg',
                contactInfo: users[1].mobileNumber,
                notes: 'Found on a study table near the window'
            },
            {
                category: 'IDs',
                description: 'University ID Card',
                date: new Date('2025-02-20'),
                location: 'Cafeteria',
                status: 'available',
                type: 'lost',
                reportedBy: users[2]._id, // Staff user
                contactInfo: users[2].mobileNumber,
                notes: 'Lost during lunch hour'
            },
            {
                category: 'Accessories',
                description: 'Blue backpack with math textbooks inside',
                date: new Date('2025-02-10'),
                location: 'Room 101, Building A',
                status: 'claimed',
                type: 'found',
                reportedBy: users[2]._id, // Staff user
                claimedBy: users[1]._id, // Student user
                photoUrl: 'https://example.com/backpack.jpg',
                contactInfo: users[2].mobileNumber
            },
            {
                category: 'Books',
                description: 'Calculus textbook',
                date: new Date('2025-02-25'),
                location: 'Math Department',
                status: 'pending',
                type: 'lost',
                reportedBy: users[1]._id, // Student user
                claimedBy: users[2]._id, // Staff user
                contactInfo: users[1].email
            }
        ];

        const createdItems = await Item.insertMany(sampleItems);
        console.log(`${createdItems.length} items created`);
        return createdItems;
    } catch (error) {
        console.error('Error seeding items:', error);
        process.exit(1);
    }
};

// Seed notifications
const seedNotifications = async (users, items) => {
    try {
        // Create sample notifications
        sampleNotifications = [
            {
                user: users[1]._id, // Student user
                type: 'success',
                title: 'Item Claim Approved',
                message: 'Your claim for "Blue backpack" has been approved. Please visit the lost and found office to collect your item.',
                read: false,
                relatedItem: items[2]._id,
                createdAt: new Date('2025-02-20')
            },
            {
                user: users[2]._id, // Staff user
                type: 'info',
                title: 'New Claim Request',
                message: 'Someone has requested to claim your lost item: "Calculus textbook".',
                read: true,
                relatedItem: items[3]._id,
                createdAt: new Date('2025-02-26')
            },
            {
                user: users[1]._id, // Student user
                type: 'info',
                title: 'Similar Item Found',
                message: 'A "University ID Card" matching your lost description has been reported.',
                read: false,
                relatedItem: items[1]._id,
                createdAt: new Date('2025-02-22')
            }
        ];

        const createdNotifications = await Notification.insertMany(sampleNotifications);
        console.log(`${createdNotifications.length} notifications created`);
        return createdNotifications;
    } catch (error) {
        console.error('Error seeding notifications:', error);
        process.exit(1);
    }
};

// Run seeding
const runSeeding = async () => {
    try {
        await clearDatabase();
        const users = await seedUsers();
        const items = await seedItems(users);
        await seedNotifications(users, items);

        console.log('Database seeding completed successfully');
        mongoose.connection.close();
    } catch (error) {
        console.error('Database seeding failed:', error);
        mongoose.connection.close();
        process.exit(1);
    }
};

// Execute seeding
runSeeding();