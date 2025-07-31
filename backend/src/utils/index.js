const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};



module.exports = {
    asyncHandler,
    StatusCodes: require("./statusCodes"),
    ReasonPhrases: require("./reasonPhrases"),
};