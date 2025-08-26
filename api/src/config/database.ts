import mongoose from "mongoose";

export const connectDatabase = async (): Promise<void> => {
  try {
    const connectionString =
      process.env.MONGODB_URI ||
      "mongodb://localhost:27017/adam-painter-booking";

    await mongoose.connect(connectionString);

    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export const closeDatabaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log("📴 Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error closing MongoDB connection:", error);
  }
};
