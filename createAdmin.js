const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('Connected to MongoDB Atlas');
        
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'mainaryan@gmail.com' });
        
        if (existingAdmin) {
            console.log('Admin user already exists');
            mongoose.connection.close();
            return;
        }
        
        // Create new admin user
        const adminUser = new User({
            name: 'Admin User',
            email: 'mainaryan@gmail.com',
            password: 'admin123', // This will be hashed by the pre-save hook
            isAdmin: true
        });
        
        await adminUser.save();
        console.log('Admin user created successfully');
        
        // Close the connection
        mongoose.connection.close();
        
    } catch (error) {
        console.error('Error creating admin user:', error);
        mongoose.connection.close();
    }
};

createAdminUser();