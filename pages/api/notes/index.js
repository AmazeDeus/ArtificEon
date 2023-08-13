// pages/api/notes/index.js
import connectDB from "../../../config/db";
import cors from "../config/cors";
import verifyJWT from "../middleware/verifyJWT";
import errorHandler from "../middleware/errorHandler";
// import { logger } from "../middleware/logger";
import {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
} from "../controllers/notesController";

export default async function handler(req, res) {
  try {
    // logger(req, res, () => {});

    await connectDB();

    // cors
    cors(req, res, () => {});

    await verifyJWT(req, res, () => {});

    if (req.method === "GET") {
      await getAllNotes(req, res);
    } else if (req.method === "POST") {
      await createNewNote(req, res);
    } else if (req.method === "PATCH") {
      await updateNote(req, res);
    } else if (req.method === "DELETE") {
      await deleteNote(req, res);
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (err) {
    errorHandler(err, req, res);
  }
}
