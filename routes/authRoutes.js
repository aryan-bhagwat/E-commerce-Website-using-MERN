const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Order = require('../backend/models/Order');
const router = express.Router();

// User Signup
router.post('/signup', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Enter a valid email').isEmail(),
    check('password', 'Password should be at least 6 characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ 
            token,
            userId: user.id 
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Server error during signup' });
    }
});

// User Signin (changed from login to signin)
// Add this to your signin route handler in authRoutes.js
// Inside the try block of your signin route

// In your signin route handler:
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        // Add console.log to debug user data
        console.log('User found:', {
            id: user._id,
            email: user.email,
            isAdmin: user.isAdmin
        });
        
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        // Make sure isAdmin is explicitly converted to boolean
        const isAdmin = !!user.isAdmin;
        
        res.json({
            token,
            userId: user._id,
            isAdmin: isAdmin
        });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
