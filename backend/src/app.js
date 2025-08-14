const express = require("express");
const { log, allowSearchTime, serverUnavailable } = require("./middleware");
const morgan = require('morgan');
const helmet = require('helmet');
const compression =require("compression")
const pool = require("./db");
const path = require("path");
const router = require("./routes/index");
const config = require("./config")
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { setConfigPublic, watchEnv } = require("./utils");

const app = express();

// Middleware 
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: config.app.base_url,
    credentials: true,
}));
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));

//Set static files directory
app.use(express.static(path.join(__dirname, "public")));

// close server if set unavailable
app.use(serverUnavailable);

// Search time middleware
setConfigPublic({
    "BASE_URL": config.app.base_url,
    "ALLOW_SEARCH_TIME": config.app.allow_search_time
});

app.use(allowSearchTime);

// Connection to the database
pool.query("SELECT version()", (err, res) => {
    if (err) {
        console.error("Database connection error:", err);
        process.exit(1);
    }
    console.log("Database connected at:", res.rows[0].version);
});

//API routes
app.use("/api", router);

app.get("/", (req, res) => {
    res.send("Captcha Generator API");
});

//Error handling middleware
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    // console.log(error);
    const status = error.status || 500;

    res.status(status).json({
        status: status,
        message: error.message,
        stack: config.env === "dev" ? error.stack : undefined,
    });
});


module.exports = app;