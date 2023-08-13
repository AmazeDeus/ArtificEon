// Not in use
const errorHandler = require("../middleware/errorHandler");
import connectDB from "../../../config/db";
import cors from "../config/cors";
import { createNewUser } from "../controllers/usersController";
// import { logger } from "../middleware/logger";

export default async function handler(req, res) {
  try {
    // logger(req, res, () => {});

    await connectDB();

    // cors
    cors(req, res, () => {});

    if (req.method === "POST") {
      await createNewUser(req, res);
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (err) {
    errorHandler(err, req, res);
  }
}
