const fs = require('fs');
const path = require('path');

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const setConfigPublic = (config) => {
    fs.writeFileSync(
        path.join(__dirname, '../../src/public/config.json'),
        JSON.stringify(config, null, 4),
    );
};

function testConnectDatabase(pool) {
    pool.query("SELECT version()", (err, res) => {
        if (err) {
            console.error("Database connection error:", err);
            process.exit(1);
        }
        console.log("Database connected at:", res.rows[0].version);
    });
}



module.exports = {
    asyncHandler,
    StatusCodes: require("./statusCodes"),
    ReasonPhrases: require("./reasonPhrases"),
    setConfigPublic,
    testConnectDatabase,
};