import mongoose from "mongoose";

const MONGODB_URI= process.env.MONGODB_URI
let isConnected = false;
async function dbConnect(){
    try{
        if (isConnected){
            console.log('already connected')
        }
        const db = await mongoose.connect(MONGODB_URI)
        isConnected = db.connections[0].readyState==1

        console.log("connected to MongoDB",db)
    }

    catch(e){
        throw error(e+"failed to connect")
    }
}

export default dbConnect;