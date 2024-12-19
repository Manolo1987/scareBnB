import mongoose from "mongoose";

// MongoDB Error-handling
mongoose.connection.on("error", () => {
  console.log("database error after initial connection");
});

// MongoDB Connection
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: process.env.DATABASE,
    });
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.log("Connection error", error);
    process.exit(1);
  }
};
