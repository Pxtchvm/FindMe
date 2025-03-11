const db = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { validationResult } = require('express-validator');

// Register a new user
exports.register = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { universityId, email, password, firstName, lastName, role, mobileNumber } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ universityId }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user with the User model
        const newUser = new User({
            universityId,
            email,
            password, // Will be hashed by the pre-save hook in the model
            firstName,
            lastName,
            role,
            mobileNumber
        });

        // Save user to database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login user
exports.login = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { universityId, password } = req.body;

        // Find user - add some debug logging
        console.log(`Login attempt for universityId: ${universityId}`);
        const user = await User.findOne({ universityId });

        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log('User found, checking password');

        // Check password using the model method
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            console.log('Password does not match');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log('Password match successful, generating token');

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                universityId: user.universityId,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};