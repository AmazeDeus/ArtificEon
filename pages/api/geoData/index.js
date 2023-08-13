// pages/api/geoData/index.js
import connectDB from "../../../config/db";
import cors from "../config/cors";
import errorHandler from "../middleware/errorHandler";
// import { logger } from "../middleware/logger";
const geoPackage = require("../geoData.json");

export default async function handler(req, res) {
  try {
    // logger(req, res, () => {});

    await connectDB();

    // cors
    cors(req, res, () => {});

    if (req.method === "GET") {
      const response = geoPackage;
      res.json({
        geoData: response,
      });
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (err) {
    errorHandler(err, req, res);
  }
}
