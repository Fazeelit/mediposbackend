import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbConnect = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ MONGODB_URI is not defined in .env");
    process.exit(1);
  }

  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("ℹ️ MongoDB already connected");
      return;
    }

    await mongoose.connect(uri);
    console.log("✅ MongoDB connected successfully");

    mongoose.connection.on("error", err =>
      console.error("❌ MongoDB error:", err.message)
    );

    mongoose.connection.on("disconnected", () =>
      console.warn("⚠️ MongoDB disconnected")
    );
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default dbConnect;
