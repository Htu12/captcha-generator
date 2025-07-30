"use strict";
const pkg = require("pg");
const config = require("../config");
const { Pool } = pkg;

const HOST = config.db.server;
const PORT = config.db.port;
const DB_NAME = config.db.database_name;
const USER = config.db.username;
const PASSWORD = config.db.password

const pool = new Pool({
    user: USER,
    host: HOST,
    database: DB_NAME,
    password: PASSWORD,
    port: PORT
})


pool.on("connect", () => {
    console.log("Connection pool established successfully");
});


module.exports = pool;
