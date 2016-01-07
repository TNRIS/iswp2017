import Hapi from 'hapi';
import Inert from 'inert'; // for static directory serving
import Vision from 'vision'; // for view rendering
import Etags from 'hapi-etags';
import Good from 'good';
import GoodConsole from 'good-console';
import swig from 'swig';

import ValidParameters from 'plugins/validParameters';

import homeRoutes from 'routes/home';
import publicRoutes from 'routes/public';
import apiRoutes from 'routes/api';

const server = new Hapi.Server({
  debug: {request: ['*']}, // TODO: Put in config
});

const loggingOptions = {
  opsInterval: 1000,
  reporters: [{
    reporter: GoodConsole,
    events: { log: '*', error: '*', request: '*' }
  }]
};

server.on('request-error', (request, err) => {
  console.error(err);
});

server.connection({
  port: 3333, // TODO: Put in config
  router: {stripTrailingSlash: true}
});

server.register([
  Inert,
  Vision,
  Etags,
  {register: Good, options: loggingOptions},
  ValidParameters
], (err) => {
  if (err) {
    console.error(err);
    return;
  }

  server.views({
    engines: {
      swig: swig
    },
    relativeTo: __dirname,
    path: './views'
  });

  publicRoutes.add(server, '/public');
  apiRoutes.add(server, '/api/v1');
  homeRoutes.add(server);

  server.route({
    method: '*',
    path: '/{p*}',
    handler: (request, reply) => {
      reply.view('404').code(404);
    }
  });

  if (!module.parent) {
    server.start(() => {
      console.log(`Server running at ${server.info.uri}`);
    });
  }
});

export default server;