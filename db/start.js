const query = require('./query');
const fs = require('fs');

const sql = fs.readFileSync('init.sql').toString();

module.exports = () => {
        query(sql, [], (err, res) => {
        if (err) {
            console.log('db init fail', err);
        }
        console.log('db init success', err);
    });
};
