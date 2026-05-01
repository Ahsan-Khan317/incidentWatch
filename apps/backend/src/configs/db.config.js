import mongoose from "mongoose";
import dns from "node:dns";
import { ENV } from "../configs/env.config.js";

export const connectDB = async () => {
  try {
    // Fix for "querySrv ECONNREFUSED" which happens on some networks
    // when the default DNS doesn't handle SRV records correctly.
    dns.setServers(["8.8.8.8", "8.8.4.4"]);

    const conn = await mongoose.connect(ENV.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
