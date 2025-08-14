const fs = require('fs');
const path = require('path');
const dotenv = require("dotenv");

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const setConfigPublic = (config) => {
    fs.writeFileSync(
        path.join(__dirname, '../../src/public/config.json'),
        JSON.stringify(config, null, 4),
    );
};


module.exports = {
    asyncHandler,
    StatusCodes: require("./statusCodes"),
    ReasonPhrases: require("./reasonPhrases"),
    setConfigPublic
};