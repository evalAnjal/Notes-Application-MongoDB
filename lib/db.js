import mongoose from "mongoose";

const MONGODB_URI= process.env.MONGODB_URI
async function dbConnect(){
    try{
        const db = await mongoose.connect(MONGODB_URI)
        console.log("connected to MongoDB",db)
    }

    catch(e){
        throw error(e+"failed to connect")
    }
}

export default dbConnect;