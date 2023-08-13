const allowedOrigins = [
  process.env.APP_URI || "http://localhost:3000",
  // "https://someOrigin.com",
  // "https://www.someOrigin.com",
];

module.exports = allowedOrigins;
