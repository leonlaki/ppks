const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'football_quiz',
    password: 'bazepodataka',
    port: 5432,
});

module.exports = pool;