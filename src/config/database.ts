import mongoose from "mongoose";

export const connectDatabase = async (): Promise<void> => {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) throw new Error("MongoDB URI required.")
    
    await mongoose.connect(mongoUri)

    console.log("MongoDB connected successfully")
    
}

