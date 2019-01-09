const query = require('../db/query');

class ServiceController {
    async clear() {
        const sqlQuery = `TRUNCATE TABLE users, forums, threads, posts, votes;`
        return await query(sqlQuery, []);
    }
}

module.exports = new ServiceController();