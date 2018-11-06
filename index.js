const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const start = require('./db/start');

const app = express();
const port = 5000;

app.use(bodyParser.json());
routes(app);
start();

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
})