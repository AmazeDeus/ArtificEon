import connectDB from "../../../config/db";
import cors from "../config/cors";
import { handleImageUpload } from "../controllers/imageHandlerController";
import multer from "multer";
import errorHandler from "../middleware/errorHandler";
import { getRecordStorage } from "../cloudinary";
// import { logger } from "../middleware/logger";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    // logger(req, res, () => {});

    await connectDB();

    // cors
    cors(req, res, () => {});

    const { documentId } = req.query;
    const storage = getRecordStorage(documentId);
    const upload = multer({ storage, limits: { fileSize: 5000000 } }); // limit - 5 megabytes

    await new Promise((resolve, reject) => {
      upload.array("images[]")(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    if (req.method === "POST") {
      await handleImageUpload(req, res);
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (err) {
    errorHandler(err, req, res);
  }
}
