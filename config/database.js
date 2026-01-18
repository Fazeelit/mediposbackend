import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbConnect = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ MONGODB_URI missing");
    process.exit(1);
  }

  try {
    if (mongoose.connection.readyState >= 1) return;

    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default dbConnect;
