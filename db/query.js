const { Pool } = require('pg');

const pool = new Pool({
    user: 'dlipko',
    host: 'localhost',
    database: 'postgres',
    password: '1',
    port: 5432,
})

module.exports = (text, params) => {
        return pool.query(text, params);
}
  
