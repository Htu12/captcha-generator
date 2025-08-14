const config = require("../config");

const HEADER_IMAGE = {
    'Content-Type': 'image/jpeg',
    'Access-Control-Allow-Origin': `${config.app.base_url}`,
    'Connection': 'keep-alive',
};

const COOKIE_KEY = "captcha_token"
const MAX_AGE = 2 * 60 * 1000;
const TYPE_IMAGE = "jpeg";

const COOKIE = {
    key: COOKIE_KEY,
    options: {
        httpOnly: true,
        secure: config.env === "prod",
        sameSite: config.env === "prod" ? "None" : "Lax", // Use 'None' for cross-site cookies in production
        maxAge: MAX_AGE,
    }
}



module.exports = {
    HEADER_IMAGE,
    COOKIE,
    TYPE_IMAGE
};
