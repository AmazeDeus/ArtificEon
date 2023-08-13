// # Position: logs/reqLog.log

const format = require("date-fns").format;
const { v4: uuid } = require("uuid");
const fs = require('fs')
const fsPromises = require('fs').promises;
const path = require("path");

const logEvents = async (message, logFileName) => {
  const dateTime = format(new Date(), "yyyyMMdd\tHH:mm:ss"); // from date-fns docs. Format: YearMonthDay \t Hour:Minute:Second
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`; // \t = Tabs. Makes it easier to import the logs into for example Excel... uuid: creates a unique id for each log item

  try {
    // if "logs" folder does not exist
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

// note: should realistically add conditionals to only log when the request is not coming from your own url or only for specific request methods
const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
  console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = { logEvents, logger };
