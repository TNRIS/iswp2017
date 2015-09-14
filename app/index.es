import Hapi from 'hapi';
import Inert from 'inert'; // for static directory serving
import Vision from 'vision'; // for view rendering
import swig from 'swig';

import homeRoutes from './routes/home';
import publicRoutes from './routes/public';
import apiRoutes from './routes/api';

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

server.register([Inert, Vision], () => {
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

  addRoutes(server, homeRoutes);
  addRoutes(server, apiRoutes, '/api/v1');
  addRoutes(server, publicRoutes, '/public');

  if (require.main === module) {
    server.start(() => {
      console.log(`Server running at ${server.info.uri}`);
    });
  }
});

export default server;