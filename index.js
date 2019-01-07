const express = require('express');
const bodyParser = require('body-parser');
const setRoutes = require('./routes/index');
const start = require('./db/start');

start();

const fastify = require('fastify')();

fastify.addContentTypeParser('application/json', { parseAs: 'buffer' }, function (req, body, done) {
    // return await new Promise((body, done) => done(null, JSON.parse(body)))
    // try {
      // var json = JSON.parse(body)
      if (body.length > 0) {
        done(null, JSON.parse(body))
      }
      else
      {
        done(null, {})
      }
    // } catch (err) {
    //   err.statusCode = 400
    //   done(null, undefined)
    // }
  })

setRoutes(fastify);

const port = 5000;

const startFastify = async () => {
    try {
        await fastify.listen(port);
        fastify.log.info(`server listening on ${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}
startFastify()