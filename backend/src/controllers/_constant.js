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

const RESPONSE_CONFIG_VALUES = {
    error: {
        "Invalid captcha": -1,
        "Missing captcha token": -2,
        "Invalid captcha solution": -3,
    },
    success: {
        "Scores retrieved successfully": 1,
        "Captcha created successfully": 2,
        "Captcha verified successfully": 3,
    }
}

module.exports = {
    HEADER,
    COOKIE,
    RESPONSE_CONFIG_VALUES
};
