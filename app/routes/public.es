
import path from 'path';

import utils from 'lib/utils';

const routes = [
  {
    method: 'GET',
    path: '/static/{param*}',
    handler: {
      directory: {
        path: path.normalize(__dirname + '../../public/static/')
      }
    }
  },
  {
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: path.normalize(__dirname + '../../public/dist/')
      }
    }
  }
]

function addTo(server, basePath = '/') {
  const validParams = server.plugins.validParameters;
  if (!validParams) {
    throw new Error('validParameters must be loaded before adding api routes');
  }

  utils.addRoutes(server, routes, basePath);
}

export default {
  addTo
};