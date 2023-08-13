import connectDB from "../../../config/db";
import cors from "../config/cors";
import verifyJWT from "../middleware/verifyJWT";
import errorHandler from "../middleware/errorHandler";
// import { logger } from "../middleware/logger";
import {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
} from "../controllers/usersController";

export default async function handler(req, res) {
  try {
    // logger(req, res, () => {});

    await connectDB();

    // cors
    cors(req, res, () => {});

    await verifyJWT(req, res, () => {});

    if (req.method === "GET") {
      await getAllUsers(req, res);
    } else if (req.method === "POST") {
      await createNewUser(req, res);
    } else if (req.method === "PATCH") {
      await updateUser(req, res);
    } else if (req.method === "DELETE") {
      await deleteUser(req, res);
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (err) {
    errorHandler(err, req, res);
  }
}
