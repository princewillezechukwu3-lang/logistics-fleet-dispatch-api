const { Pool } = require('pg');
require('dotenv').config();

const dbConnectionString = process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL : process.env.LOCAL_DATABASE_URL
const sslSetting = process.env.NODE_ENV === 'production' ? {rejectUnauthorized: false} : false

const pool = new Pool ({
    connectionString: dbConnectionString,
    ssl: sslSetting
})

console.log(`Database Engine initialized in [${process.env.NODE_ENV || 'development'}] mode.`);

module.exports = pool