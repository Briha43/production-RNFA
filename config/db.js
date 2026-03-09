const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        
        // Use the URI from .env and force IPv4
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`--- SUCCESS: MongoDB Connected ---`);
        console.log(`Host: ${conn.connection.host}`);
    } catch (error) {
        console.log("--- DB CONNECTION ERROR ---");
        console.log("Error Name:", error.name);
        console.log("Error Message:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;