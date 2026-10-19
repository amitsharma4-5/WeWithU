import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model.js';

dotenv.config();

const checkCredits = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to DB");
        
        const users = await User.find({});
        console.log("Users found:", users.length);
        
        users.forEach(user => {
            console.log(`User: ${user.name}, Email: ${user.email}, Credits: ${user.credits}`);
        });
        
        await mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
    }
};

checkCredits();
