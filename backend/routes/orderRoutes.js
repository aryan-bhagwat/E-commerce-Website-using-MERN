const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Cart = require('../../models/Cart');
const auth = require('../middleware/auth');
const router = express.Router();

// Create a new order
router.post('/create', auth, async (req, res) => {
    try {
        const { userId, shippingAddress, paymentMethod } = req.body;
        
        // Verify user
        if (userId !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized access' });
        }
        
        // Get cart items
        const cart = await Cart.findOne({ userId });
        if (!cart || !cart.products || cart.products.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }
        
        // Calculate total
        const totalAmount = cart.products.reduce(
            (sum, item) => sum + (item.price * item.quantity), 0
        );
        
        // Create new order
        const newOrder = new Order({
            userId,
            products: cart.products,
            totalAmount,
            shippingAddress,
            paymentMethod,
            status: 'pending'
        });
        
        const savedOrder = await newOrder.save();
        
        // Clear the cart
        cart.products = [];
        await cart.save();
        
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: error.message || 'Failed to create order' });
    }
});

// Get order history for a user
router.get('/history/:userId', auth, async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Verify user
        if (userId !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized access' });
        }
        
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching order history:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch order history' });
    }
});

// Get order details
router.get('/:orderId', auth, async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        // Verify user
        if (order.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized access to order' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch order details' });
    }
});

module.exports = router; 