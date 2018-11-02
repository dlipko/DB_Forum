'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _require = require('pg'),
    Pool = _require.Pool;

var pool = new Pool({
    user: 'dlipko',
    host: 'localhost',
    database: 'api',
    password: '1',
    port: 5432
});

exports.default = function (text, params) {
    return pool.query(text, params);
};