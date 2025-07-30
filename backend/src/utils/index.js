const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};




const httpStatusCode = require('./httpStatusCode');

module.exports = {
    asyncHandler,
    httpStatusCode
};