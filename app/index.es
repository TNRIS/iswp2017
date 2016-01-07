import Hapi from 'hapi';
import Inert from 'inert'; // for static directory serving
import Vision from 'vision'; // for view rendering
import Etags from 'hapi-etags';
import Good from 'good';
import GoodConsole from 'good-console';
import swig from 'swig';

import utils from 'lib/utils';
import ApiModule from 'modules/api';
import homeRoutes from 'routes/home';
import publicRoutes from 'routes/public';


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
  ApiModule
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

  utils.addRoutes(server, publicRoutes, '/public');
  utils.addRoutes(server, homeRoutes);

  server.route({
    method: '*',
    path: '/{p*}',
    handler: (request, reply) => {
      reply.view('404').code(404);
    }
  });

  if (require.main === module) {
    server.start(() => {
      console.log(`Server running at ${server.info.uri}`);
    });
  }
});

export default server;