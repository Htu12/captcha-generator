const express = require("express");
const { log } = require("./middleware");
const pool = require("./db");
const router = require("./routes/index");
const config = require("./config")
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// Middleware 
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: config.app.base_url,
    credentials: true,
}));

//logging middleware
app.use(log);

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
    res.send("Welcome to the Captcha Generator API");
})


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
        stack: config.app.env === "dev" ? error.stack : undefined,
    });
});


module.exports = app;