const config = require("../config");

const HEADER = {
    'Content-Type': 'image/jpeg',
    'Access-Control-Allow-Origin': `${config.app.base_url}`,
    'Connection': 'keep-alive',
};

const PRODUCTION = "prod";
const SAMESITE = "None"; // Use 'None' for cross-site cookies, 'Lax' for same-site cookies
const MAX_AGE = 2 * 60 * 1000;

module.exports = {
    HEADER,
    PRODUCTION,
    MAX_AGE,
    SAMESITE
};
