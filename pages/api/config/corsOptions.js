// pages/api/config/corsOptions.js
const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;
