import connectDB from "../../../config/db";
import cors from "../config/cors";
import verifyJWT from "../middleware/verifyJWT";
import errorHandler from "../middleware/errorHandler";
// import { logger } from "../middleware/logger";
import {
  deletePost,
} from "../controllers/postsController";

export default async function handler(req, res) {
  try {
    // logger(req, res, () => {});

    // cors
    cors(req, res, () => {});

    await connectDB();

    if (req.method === "DELETE") {
      await verifyJWT(req, res, () => {});
      await deletePost(req, res);
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (err) {
    errorHandler(err, req, res);
  }
}
