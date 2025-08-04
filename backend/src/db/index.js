"use strict";
const pkg = require("pg");
const config = require("../config");
const { Pool } = pkg;


const pool = new Pool({
    user: String(config.db.username),
    host: String(config.db.server),
    database: String(config.db.database_name),
    password: String(config.db.password),
    port: Number(config.db.port),
})


module.exports = pool;
