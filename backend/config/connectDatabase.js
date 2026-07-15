import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDb connected to : " + mongoose.connection.host);
    console.log("Database:", mongoose.connection.name);
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
};

export default connectDB;
