// # Position: logs/errLog.log

const { logEvents } = require("./logger");

// override the default express error handling
const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLog.log"
  );
  console.log(err.stack); // every detail about the error

  const status = res.statusCode ? res.statusCode : 500; // server error

  res.status(status);

  // isError: true - Because of how errors are being handled in Redux and RTK Query. Need this second flag which RTK Query is going to look for when unexpected errors occur.
  res.json({ message: err.message, isError: true });
};

module.exports = errorHandler;
