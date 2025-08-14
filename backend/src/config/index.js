const CAPTCHA_LEVELS = require("./_constant");

require("dotenv").config({
    path: './.env'
});

const prod = {
    env: process.env.NODE_ENV,
    isAvailable: process.env.IS_AVAILABLE === "1",
    app: {
        port: process.env.PORT_PROD,
        captcha_level: CAPTCHA_LEVELS[process.env.CAPTCHA_LEVEL_PROD],
        base_url: process.env.BASE_URL_PROD,
        allow_search_time: process.env.ALLOW_SEARCH_TIME || "",
    },
    db: {
        server: process.env.DB_SERVER_PROD,
        port: process.env.DB_PORT_PROD,
        database_name: process.env.DB_NAME_PROD,
        username: process.env.DB_USER_PROD,
        password: process.env.DB_PASSWORD_PROD
    }
}

const dev = {
    env: process.env.NODE_ENV || "dev",
    isAvailable: process.env.IS_AVAILABLE === "1",
    app: {
        port: process.env.PORT_DEV || 3000,
        captcha_level: CAPTCHA_LEVELS[process.env.CAPTCHA_LEVEL_DEV],
        base_url: process.env.BASE_URL_DEV,
        allow_search_time: process.env.ALLOW_SEARCH_TIME || "",
    },
    db: {
        server: process.env.DB_SERVER_DEV,
        port: process.env.DB_PORT_DEV,
        database_name: process.env.DB_NAME_DEV,
        username: process.env.DB_USER_DEV,
        password: process.env.DB_PASSWORD_DEV
    }
}


const config = { dev, prod };
const env = process.env.NODE_ENV || "dev";

module.exports = config[env]