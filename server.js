require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const connectDB = require('./db');

const app = express();

// Middleware
app.use(express.json()); // ✅ Enable JSON parsing
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
})); // ✅ Enable CORS

// Connect to MongoDB with error handling
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.once('open', () => {
    console.log('MongoDB successfully connected');
});

// Connect to MongoDB
(async () => {
    try {
        await connectDB();
        
        // Load models
        require('./models/Cart');
        require('./models/Product');
        
        // Routes
        const productRoutes = require('./routes/productRoutes');
        const authRoutes = require('./routes/authRoutes');
        const cartRoutes = require('./routes/cartRoutes');

        app.use('/products', productRoutes);
        app.use('/auth', authRoutes);
        app.use('/cart', cartRoutes);  
        // Remove this duplicate route - it's causing confusion
        // app.use('/api/cart', require('./routes/cartRoutes'));

        // Start the Server
        const PORT = process.env.PORT || 5001; // Changed to 5001
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
})();

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
});

// Remove this duplicate server start
// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
