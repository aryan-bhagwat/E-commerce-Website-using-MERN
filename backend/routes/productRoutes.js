const express = require('express');
const Product = require('../models/Product');
const router = express.Router();
const auth = require('../middleware/auth');

// Add a New Product
router.post('/add', async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body;
        
        // Ensure category is not empty
        if (!category) {
            return res.status(400).json({ error: "Category is required" });
        }
        
        const newProduct = new Product({ 
            name, 
            description, 
            price, 
            image, 
            category 
        });
        
        await newProduct.save();
        res.json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all products with optional filters
router.get('/all', async (req, res) => {
    try {
        const { 
            search, 
            category, 
            minPrice, 
            maxPrice, 
            inStock,
            sortBy 
        } = req.query;

        // Build query
        let query = {};
        
        // Search functionality
        if (search) {
            // Create a text index for better search if you haven't already
            // In MongoDB shell: db.products.createIndex({ name: "text", description: "text" })
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Category filter
        if (category) {
            query.category = category;
        }
        
        // Price range filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        
        // In stock filter
        if (inStock === 'true') {
            query.inStock = true;
        }

        // Build sort options
        let sortOptions = {};
        if (sortBy === 'price_asc') {
            sortOptions.price = 1;
        } else if (sortBy === 'price_desc') {
            sortOptions.price = -1;
        } else if (sortBy === 'newest') {
            sortOptions.createdAt = -1;
        } else if (sortBy === 'rating') {
            sortOptions.rating = -1;
        } else {
            // Default sort by newest
            sortOptions.createdAt = -1;
        }

        const products = await Product.find(query).sort(sortOptions);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get product categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete product
router.delete('/delete/:id', auth, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 