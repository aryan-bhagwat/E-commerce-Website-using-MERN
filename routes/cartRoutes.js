const express = require('express');
const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const router = express.Router();
const auth = require('../middleware/auth');

// Add Item to Cart
router.post('/add', auth, async (req, res) => {
    const { userId, productId, name, price } = req.body;
    
    console.log('Received request body:', req.body); // Debug log
    
    // Validate input
    if (!userId || !productId || !name || price === undefined) {
        return res.status(400).json({ 
            error: 'Missing required fields',
            details: 'userId, productId, name, and price are required'
        });
    }

    try {
        // Check if Cart model is properly loaded
        if (!Cart || !Cart.findOne) {
            console.error('Cart model is not properly initialized');
            return res.status(500).json({ 
                error: 'Internal server error - Cart model not initialized'
            });
        }

        // Ensure productId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ 
                error: 'Invalid productId format'
            });
        }

        let cart = await Cart.findOne({ userId });
        console.log('Found cart:', cart); // Debug log
        
        if (!cart) {
            // Create new cart
            cart = new Cart({
                userId,
                products: [{
                    productId: new mongoose.Types.ObjectId(productId),
                    name,
                    price: Number(price),
                    quantity: 1
                }]
            });
        } else {
            // Update existing cart
            const productIndex = cart.products.findIndex(
                p => p.productId.toString() === productId
            );
            
            if (productIndex > -1) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({
                    productId: new mongoose.Types.ObjectId(productId),
                    name,
                    price: Number(price),
                    quantity: 1
                });
            }
        }

        const savedCart = await cart.save();
        console.log('Saved cart:', savedCart); // Debug log
        res.status(200).json(savedCart);
    } catch (error) {
        console.error('Error in cart addition:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to add item to cart'
        });
    }
});

// Get User's Cart
router.get('/:userId', auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) {
            cart = new Cart({ userId: req.params.userId, products: [] });
            await cart.save();
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching cart' });
    }
});

// Update cart item quantity
router.put('/update', auth, async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const product = cart.products.find(p => p.productId === productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        if (quantity <= 0) {
            cart.products = cart.products.filter(p => p.productId !== productId);
        } else {
            product.quantity = quantity;
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error updating cart' });
    }
});

// Remove item from cart
router.delete('/remove', auth, async (req, res) => {
    try {
        const { userId, productId } = req.body;
        
        console.log('Remove request received:', { userId, productId }); // Debug log
        
        if (!userId || !productId) {
            return res.status(400).json({ error: 'userId and productId are required' });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Find the product index
        const productIndex = cart.products.findIndex(p => {
            return p.productId.toString() === productId.toString();
        });

        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        // Remove the product
        cart.products.splice(productIndex, 1);
        
        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
});

module.exports = router;
