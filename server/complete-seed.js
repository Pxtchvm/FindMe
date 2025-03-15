/**
 * Complete Seed Script for FindMe App
 * 
 * This script creates users with correct password hashing,
 * and also creates sample items and notifications.
 * Run with: node complete-seed.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected for complete seeding'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });
mongoose.set('strictQuery', false);  // Or true, depending on your preference
    
// Import models
const User = require('./models/user.model');
const Item = require('./models/item.model');
const Notification = require('./models/notification.model');

// Sample data with fixed password
const COMMON_PASSWORD = 'password123';
const HASHED_PASSWORD = bcrypt.hashSync(COMMON_PASSWORD, 10);

// Sample users with pre-hashed passwords
const sampleUsers = [
    {
        universityId: 'admin123',
        email: 'admin@example.com',
        password: HASHED_PASSWORD,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        mobileNumber: '1234567890'
    },
    {
        universityId: 'student001',
        email: 'student@example.com',
        password: HASHED_PASSWORD,
        firstName: 'John',
        lastName: 'Doe',
        role: 'student',
        mobileNumber: '0987654321'
    },
    {
        universityId: 'staff001',
        email: 'staff@example.com',
        password: HASHED_PASSWORD,
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

// Seed users directly (bypass pre-save hook)
const seedUsers = async () => {
    try {
        console.log('Creating users with fixed password hash...');

        // Insert users directly to avoid model pre-save hook
        const result = await User.insertMany(sampleUsers);

        console.log(`Created ${result.length} users with password: ${COMMON_PASSWORD}`);

        // Double-check - verify we can retrieve them
        const users = await User.find();
        users.forEach(user => {
            console.log(`- ${user.role}: ${user.universityId} (${user.firstName} ${user.lastName})`);
        });

        return users;
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
            category: "Electronics",
            description: "Black HP laptop with blue case",
            date: new Date("2025-02-15"),
            location: "Library, 2nd Floor",
            status: "available",
            type: "found",
            reportedBy: users[1]._id, // Student user
            photoUrl:
              "https://images.unsplash.com/photo-1597673030062-0a0f1a801a31?q=80&w=1992&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            contactInfo: users[1].mobileNumber,
            notes: "Found on a study table near the window",
          },
          {
            category: "IDs",
            description: "University ID Card",
            date: new Date("2025-02-20"),
            location: "Cafeteria",
            status: "available",
            type: "lost",
            reportedBy: users[2]._id, // Staff user
            contactInfo: users[2].mobileNumber,
            notes: "Lost during lunch hour",
          },
          {
            category: "Accessories",
            description: "Blue backpack with math textbooks inside",
            date: new Date("2025-02-10"),
            location: "Room 101, Building A",
            status: "claimed",
            type: "found",
            reportedBy: users[2]._id, // Staff user
            claimedBy: users[1]._id, // Student user
            photoUrl:
              "https://st2.depositphotos.com/4431055/11351/i/450/depositphotos_113513424-School-Backpack-on-background.jpg",
            contactInfo: users[2].mobileNumber,
          },
          {
            category: "Books",
            description: "Calculus textbook",
            date: new Date("2025-02-25"),
            location: "Math Department",
            status: "pending",
            type: "lost",
            reportedBy: users[1]._id, // Student user
            claimedBy: users[2]._id, // Staff user
            contactInfo: users[1].email,
          },
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

// Test password verification
const testPasswordVerification = async () => {
    try {
        console.log('\nTesting password verification...');

        for (const sampleUser of sampleUsers) {
            const user = await User.findOne({ universityId: sampleUser.universityId });

            // Test with correct password
            const isValid = await bcrypt.compare(COMMON_PASSWORD, user.password);
            console.log(`${user.universityId}: Password verification ${isValid ? 'SUCCEEDED' : 'FAILED'}`);
        }
    } catch (error) {
        console.error('Error testing password verification:', error);
    }
};

// Run the complete seeding
const runCompleteSeeding = async () => {
    try {
        await clearDatabase();
        const users = await seedUsers();
        const items = await seedItems(users);
        await seedNotifications(users, items);
        await testPasswordVerification();

        console.log('\nComplete seeding finished successfully!');
        console.log(`You can now log in with any of the following users (password: ${COMMON_PASSWORD}):`);
        console.log('- Admin:    admin123');
        console.log('- Student:  student001');
        console.log('- Staff:    staff001');

        mongoose.connection.close();
    } catch (error) {
        console.error('Complete seeding failed:', error);
        mongoose.connection.close();
        process.exit(1);
    }
};

// Execute the complete seeding
runCompleteSeeding();