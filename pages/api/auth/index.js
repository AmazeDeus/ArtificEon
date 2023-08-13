import connectDB from "../../../config/db";
import cors from "../config/cors";
import loginLimiter from "../middleware/loginLimiter";
import errorHandler from "../middleware/errorHandler";
import { login } from "../controllers/authController";
// import { logger } from "../middleware/logger";

export default async function handler(req, res) {
  try {
    // logger(req, res, () => {});

    await connectDB();

    // cors
    cors(req, res, () => {});

    if (req.method === "POST") {
      await loginLimiter(req, res, () => {});
      await login(req, res);
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (err) {
    errorHandler(err, req, res);
  }
}
