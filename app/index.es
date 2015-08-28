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

  if (base.lastIndexOf('/') === base.length - 1) {
    base = base.slice(0, base.length - 1);
  }

  routes.forEach((route) => {
    route.path = base + route.path;
    server.route(route);
  });
}

const server = new Hapi.Server({debug: {request: ['*']}});
server.register([Inert, Vision], () => {
  server.connection({port: 3333});

  server.views({
    engines: {
      swig: swig
    },
    relativeTo: __dirname,
    path: './views'
  });

  addRoutes(server, homeRoutes);
  addRoutes(server, apiRoutes, '/api');
  addRoutes(server, publicRoutes, '/public');

  server.start(() => {
    console.log(`Server running at ${server.info.uri}`);
  });
});