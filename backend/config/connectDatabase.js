import dns from "node:dns";
import mongoose from "mongoose";

const connectDB = async (retried = false) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDb connected to : " + mongoose.connection.host);
    console.log("Database:", mongoose.connection.name);
  } catch (error) {
    // Some networks' DNS servers fail the SRV lookup that "mongodb+srv://"
    // needs; retry once through public DNS servers
    if (error.syscall === "querySrv" && !retried) {
      console.log("MongoDB SRV lookup failed, retrying with public DNS...");
      dns.setServers(["1.1.1.1", "8.8.8.8"]);
      return connectDB(true);
    }
    console.log("Error connecting to MongoDB", error);
  }
};

export default connectDB;
