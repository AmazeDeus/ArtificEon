import connectDB from "../../../config/db";
import cors from "../config/cors";
import { logout } from "../controllers/authController";
import errorHandler from "../middleware/errorHandler";
// import { logger } from "../middleware/logger";

export default async function handler(req, res) {
  try {
    // logger(req, res, () => {});

    await connectDB();

    // cors
    cors(req, res, () => {});

    if (req.method === "POST") {
      await logout(req, res);
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (err) {
    errorHandler(err, req, res);
  }
}
