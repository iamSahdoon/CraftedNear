import dns from "node:dns";
import mongoose from "mongoose";

// On Vercel each request can start a fresh instance, so the connection is made
// once and reused. Requests wait for it instead of queueing queries against a
// database that isn't connected yet (which times out after 10s as "buffering").
let connecting = null;

const openConnection = async (retried = false) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // fail fast enough to report the real reason inside the request
      serverSelectionTimeoutMS: 8000,
    });
    console.log("MongoDb connected to : " + mongoose.connection.host);
    console.log("Database:", mongoose.connection.name);
  } catch (error) {
    // Some networks' DNS servers fail the SRV lookup that "mongodb+srv://"
    // needs; retry once through public DNS servers
    if (error.syscall === "querySrv" && !retried) {
      console.log("MongoDB SRV lookup failed, retrying with public DNS...");
      dns.setServers(["1.1.1.1", "8.8.8.8"]);
      return openConnection(true);
    }
    console.log("Error connecting to MongoDB:", error.name, "-", error.message);
    throw error;
  }
};

const connectDB = () => {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (!connecting) {
    // let the next request try again if this attempt fails
    connecting = openConnection().catch((error) => {
      connecting = null;
      throw error;
    });
  }
  return connecting;
};

export default connectDB;
