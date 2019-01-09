const setRoutes = require('./routes/index');
const start = require('./db/start');

// const morgan  = require('morgan');

start();

const fastify = require('fastify')({
  logger: false
})

// fastify.use(morgan('dev'));

// EMPTY BODY
if (!fastify.hasContentTypeParser('application/json')) {
  fastify.addContentTypeParser('application/json', { parseAs: 'buffer'}, 
  (_, body, done) => {
    if (body.length > 0) {
      done(null, JSON.parse(body));
    } else {
      done(null, {});
    }
  });
}

setRoutes(fastify);

const port = 5000;

const startFastify = async () => {
  try {
    await fastify.listen(port, '0.0.0.0');
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
startFastify()