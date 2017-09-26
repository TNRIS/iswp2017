
import utils from 'lib/utils';

const routes = [
  {
    method: 'GET',
    path: '/static/{param*}',
    handler: {
      directory: {
        path: 'static/',
        redirectToSlash: true,
      },
    },
  },
  {
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'dist/',
        redirectToSlash: true,
      },
    },
  },
];

/**
 * Add a route
 * @param {object} server - server the server instance to attach to
 * @param {string} basePath - path
 */
function addTo(server, basePath = '/') {
  const validParams = server.plugins.validParameters;
  if (!validParams) {
    throw new Error('validParameters must be loaded before adding api routes');
  }

  utils.addRoutes(server, routes, basePath);
}

export default {
  addTo,
};
