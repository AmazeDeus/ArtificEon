module.exports = func => { // Accept a function.
    return (req, res, next) => { // returns a function
        func(req, res, next).catch(next) // Executes the function passed in on line 1. If any errors occur in the function passed in, pass it into next.
    }
}