// Defines a custom ExpressError class that extends the built-in Error class, taking in two arguments: message and statusCode
// allows to provide more specific error messages and status codes when an error occurs
// -ex. throw new Error => throw new ExpressError('Missing someParam', 400);

class ExpressError extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;