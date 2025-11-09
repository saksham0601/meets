
import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env.local");
}

const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "meetsLive", 
    });
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};

export default connectMongoDB;
