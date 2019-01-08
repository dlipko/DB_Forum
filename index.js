const setRoutes = require('./routes/index');
const start = require('./db/start');

start();

const fastify = require('fastify')();

// EMPTY BODY
if (!fastify.hasContentTypeParser('application/json')) {
  fastify.addContentTypeParser('application/json', { parseAs: 'buffer'}, 
  (_, body, done) => {
    try {
      done(null, JSON.parse(body));
    } catch (error) {
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