const mongoose = require("mongoose");
const dbUri = process.env.DB_URI || "mongodb://127.0.0.1:27017/artificeon";
import { logEvents } from "@/pages/api/middleware/logger";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Already connected to MongoDB");
      return;
    }

    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 50000,
    });

    mongoose.connection.once("open", () => {
      console.log("Connected to MongoDB");
    });

    mongoose.connection.on("error", (err) => {
      console.log(err);
      logEvents(
        `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
        "mongoErrLog.log"
      );
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
