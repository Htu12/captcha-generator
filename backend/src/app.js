const express = require("express");
const { log } = require("./middleware");
const { OK } = require("./utils/response/success.response");
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

//Test database connection
app.get("/test-db", async (req, res) => {
    const pool = require("./db/index");
    const result = await pool.query("SELECT * from score_2025_19 LIMIT 10");
    new OK({
        message: "Database connection successful",
        data: result.rows,
    }).send(res);
});

//API routes
app.use("/api", router)

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