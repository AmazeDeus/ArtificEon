// pages/api/middleware/cors.js
import corsOptions from "./corsOptions";

export default function cors(req, res, next) {
  const allowedOrigins = corsOptions.origin;
  const requestOrigin = req.headers.origin;

  if (allowedOrigins.includes(requestOrigin)) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
    res.setHeader("Access-Control-Allow-Credentials", corsOptions.credentials);
  }

  next();
}
