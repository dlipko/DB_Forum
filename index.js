import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/index';
import start from './db/start';

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