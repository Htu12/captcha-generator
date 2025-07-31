const config = require("../config");

const HEADER = {
    'Content-Type': 'image/jpeg',
    'Access-Control-Allow-Origin': `${config.app.base_url}`,
    'Connection': 'keep-alive',
};

const COOKIE_KEY = "captcha_token"
const SAMESITE = "None"; 
const MAX_AGE = 2 * 60 * 1000;

const COOKIE = {
    key: COOKIE_KEY,
    options: {
        httpOnly: true,
        secure: true,
        sameSite: SAMESITE,
        maxAge: MAX_AGE,
    }
}



module.exports = {
    HEADER,
    COOKIE,
};
