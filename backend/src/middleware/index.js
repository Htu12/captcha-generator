"use strict";

const config = require("../config/index");
const { ForbiddenError } = require("../utils/response/error.response");

function log(req, res, next) {
    const start = Date.now();
    const path = req.path;

    res.on("finish", () => {
        const duration = Date.now() - start;
        if (path.startsWith("/api")) {
            let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;

            if (logLine.length > 80) {
                logLine = logLine.slice(0, 79) + "…";
            }

            console.log(`[${new Date().toISOString()}] ${logLine}`);
        }
    });

    next();
}

function allowSearchTime(req, res, next) {
    // Get current time in Jakarta timezone
    const currentTime = new Date();
    const allowedTime = new Date(config.app.allow_search_time);

    if (currentTime < allowedTime) {
        throw new ForbiddenError("Search is not allowed at this time.");
    }

    next();
}

function serverUnavailable(req, res, next) {
    if (!config.isAvailable) {
        res.status(503).send("<h1>Server is too busy</h1>");
    } else {
        next();
    }
}

module.exports = {
    log,
    allowSearchTime,
    serverUnavailable
};