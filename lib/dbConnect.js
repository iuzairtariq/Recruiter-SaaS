import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        if (mongoose.connections[0].readyState) return;
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('⚡️ MongoDB Connected!');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
    }
};
            
export default connectDB;