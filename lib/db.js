import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
let isConnected = false;

async function dbConnect() {
    if (!MONGODB_URI) {
        throw new Error("Missing MONGODB_URI in environment variables");
    }

    if (isConnected) {
        return mongoose.connection;
    }

    try {
        const db = await mongoose.connect(MONGODB_URI);
        isConnected = db.connections[0].readyState === 1;
        return db;
    } catch (e) {
        throw new Error(`Failed to connect to MongoDB: ${e.message}`);
    }
}

export default dbConnect;