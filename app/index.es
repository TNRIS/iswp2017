import Hapi from 'hapi';
import Inert from 'inert'; // for static directory serving
import Vision from 'vision'; // for view rendering
import Good from 'good';
import GoodConsole from 'good-console';
import swig from 'swig';

import homeRoutes from 'routes/home';
import publicRoutes from 'routes/public';
import apiRoutes from 'routes/api';

function addRoutes(server, routes, base = '') {
  if (!Array.isArray(routes)) {
    throw new Error('Routes must be an array');
  }

  let basePath = base;
  if (basePath.lastIndexOf('/') === basePath.length - 1) {
    basePath = basePath.slice(0, basePath.length - 1);
  }

  routes.forEach((route) => {
    route.path = basePath + route.path;
    server.route(route);
  });
}

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

server.register([Inert, Vision, {register: Good, options: loggingOptions}], (err) => {
  if (err) {
    console.error(err);
    return;
  }

  server.connection({
    port: 3333, // TODO: Put in config
    router: {stripTrailingSlash: true}
  });

  server.views({
    engines: {
      swig: swig
    },
    relativeTo: __dirname,
    path: './views'
  });

  addRoutes(server, publicRoutes, '/public');
  addRoutes(server, apiRoutes, '/api/v1');
  addRoutes(server, homeRoutes);

  if (require.main === module) {
    server.start(() => {
      console.log(`Server running at ${server.info.uri}`);
    });
  }
});

export default server;