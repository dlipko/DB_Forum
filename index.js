const setRoutes = require('./routes/index');
const start = require('./db/start');
const cluster = require('cluster');

const morgan  = require('morgan');

start();


const fastify = require('fastify');

const workers = [];

const setupWorkerProcesses = () => {
  // to read number of cores on system
  const numCores = 2;

  for (let i = 0; i < numCores; i += 1) {
    workers.push(cluster.fork());

    // to receive messages from worker process
    workers[i].on('message', (message) => {
      console.log(message);
    });
  }

  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is listening`);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
    console.log('Starting a new worker');
    cluster.fork();
    workers.push(cluster.fork());

    workers[workers.length - 1].on('message', (message) => {
      console.log(message);
    });
  });
};





const setUpFastify = () => {
  const service = fastify({
    logger: false,
  });
  // service.use(morgan('dev'));
  service.addContentTypeParser(
    'application/json', {
      parseAs: 'buffer'
    },
    (req, body, done) => {
      if (body.length > 0) {
        done(null, JSON.parse(body));
      } else done(null, {});
    },
  );


  setRoutes(service);

  const port = 5000;

  service.listen(port, '0.0.0.0');
  console.log('Started');
};



// EMPTY BODY
// if (!fastify.hasContentTypeParser('application/json')) {
//   fastify.addContentTypeParser('application/json', { parseAs: 'buffer'}, 
//   (_, body, done) => {
//     try {
//       done(null, JSON.parse(body));
//     } catch (error) {
//       done(null, {});
//     }
//   });
// }


// const startFastify = async () => {
//   try {
//     await fastify.listen(port, '0.0.0.0');
//     fastify.log.info(`server listening on ${fastify.server.address().port}`);
//   } catch (err) {
//     fastify.log.error(err);
//     process.exit(1);
//   }
// }
// startFastify()

const setupServer = (isClusterRequired) => {
  if (isClusterRequired && cluster.isMaster) {
    setupWorkerProcesses();
  } else setUpFastify();
};

setupServer(true);