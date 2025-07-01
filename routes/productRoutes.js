const express = require('express');
const Product = require('../models/Product');
const router = express.Router();
const auth = require('../middleware/auth');

// Add a New Product - Admin only
router.post('/add', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }

        const { name, description, price, image, category } = req.body;
        const newProduct = new Product({ name, description, price, image, category });
        await newProduct.save();
        res.json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Products - Public access
router.get('/all', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a Product - Admin only
router.delete('/delete/:id', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get product categories - Public access
router.get('/categories', async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
