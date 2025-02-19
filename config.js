"use strict"

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || 'secretkeyhere'

const PORT = +process.env.PORT || 3001;

// test DB when NODE_ENV test, main db in prod
function getDatabaseUri () {
    return (process.env.NODE_ENV === 'test')
        ? process.env.DB_STRING_TEST
        : process.env.DB_STRING;
};

// work factor reduced for tests to increase speed
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

module.exports = { 
    PORT, 
    BCRYPT_WORK_FACTOR,
    getDatabaseUri,
    SECRET_KEY
};