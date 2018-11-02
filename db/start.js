import query from './query';
import fs from'fs';

const sql = fs.readFileSync('init.sql').toString();

export default () => {
        query(sql, [], (err, res) => {
        if (err) {
            console.log('db init fail', err);
        }
        console.log('db init success', err);
    });
};
