
import path from 'path';
import Joi from 'joi';

import utils from 'lib/utils';

function to404(request, reply) {
  return reply.view('404').code(404);
}

function addTo(server, basePath = '/') {
  const validParams = server.plugins.validParameters;
  if (!validParams) {
    throw new Error('validParameters must be loaded before adding api routes');
  }

  const routes = [
    {
      method: 'GET',
      path: '/',
      handler: {view: 'index'}
    },
    {
      method: 'GET',
      path: '/statewide',
      handler: {view: 'index'}
    },
    {
      method: 'GET',
      path: '/region/{regionLetter}',
      config: {
        validate: {
          params: {
            regionLetter: Joi.string().only(validParams.regions).insensitive().required()
          },
          failAction: to404
        }
      },
      handler: {view: 'index'}
    },
    {
      method: 'GET',
      path: '/county/{county}',
      config: {
        validate: {
          params: {
            county: Joi.string().only(validParams.counties).insensitive().required()
          },
          failAction: to404
        }
      },
      handler: {view: 'index'}
    },
    {
      method: 'GET',
      path: '/entity/{entityId}',
      config: {
        validate: {
          params: {
            entityId: Joi.number().only(validParams.entityIds).required()
          },
          failAction: to404
        }
      },
      handler: {view: 'index'}
    },
    {
      method: 'GET',
      path: '/source/{sourceId}',
      config: {
        validate: {
          params: {
            sourceId: Joi.number().required()
          },
          failAction: to404
        }
      },
      handler: {view: 'index'}
    },
    {
      method: 'GET',
      path: '/usagetype/{usageType}',
      config: {
        validate: {
          params: {
            usageType: Joi.string().only(validParams.usageTypes).required()
          },
          failAction: to404
        }
      },
      handler: {view: 'index'}
    },
    {
      method: 'GET',
      path: '/project/{projectId}',
      config: {
        validate: {
          params: {
            projectId: Joi.number().only(validParams.projects).required()
          },
          failAction: to404
        }
      },
      handler: {view: 'index'}
    },
    {
      method: 'GET',
      path: '/about',
      handler: {view: 'about'}
    },
    {
      method: 'GET',
      path: '/humans.txt',
      handler: {
        file: {
          path: path.normalize(__dirname + '../../public/static/humans.txt')
        }
      }
    },
    {
      method: 'GET',
      path: '/robots.txt',
      handler: (request, reply) => {
        //serve blank (allow-all) robots.txt when in production
        if (process.env.NODE_ENV === 'production') {
          reply('');
        }
        //else disallow all
        else {
          reply.file(path.normalize(__dirname + '../../public/static/nobots.txt'));
        }
      }
    }
  ];

  utils.addRoutes(server, routes, basePath);
}

export default {
  addTo
};