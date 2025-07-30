const express = require("express");
const { log } = require("./middleware/");
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
    const result = await pool.query("SELECT * from score_2025_19");
    res.json(result.rows);
});

//API routes
app.use("/api", router)

app.get("/", (req, res) => {
    res.send("Welcome to the Captcha Generator API");
})

//Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});


module.exports = app;