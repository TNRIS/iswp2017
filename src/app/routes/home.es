
import path from 'path';
import Joi from 'joi';

import {addRoutes} from 'lib/utils';

/**
 * Returns a 404 error
 * @param {object} request - server request
 * @param {object} reply - server reply
 * @return {view} 404 error
 */
function to404(request, reply) {
  return reply.view('404').code(404);
}

/**
 * Add routes to the server
 * @param {object} server - server instance
 * @param {string} basePath - base path string
 */
function addTo(server, basePath = '/') {
  const validParams = server.plugins.validParameters;
  if (!validParams) {
    throw new Error('validParameters must be loaded before adding api routes');
  }

  const routes = [
    {
      method: 'GET',
      path: '/',
      handler: {view: 'index'},
    },
    {
      method: 'GET',
      path: '/statewide',
      handler: {view: 'index'},
    },
    {
      method: 'GET',
      path: '/region/{regionLetter}',
      config: {
        validate: {
          params: {
            regionLetter: Joi.string().only(validParams.regions)
            .insensitive().required(),
          },
          failAction: to404,
        },
      },
      handler: {view: 'index'},
    },
    {
      method: 'GET',
      path: '/county/{county}',
      config: {
        validate: {
          params: {
            county: Joi.string().only(validParams.counties)
            .insensitive().required(),
          },
          failAction: to404,
        },
      },
      handler: {view: 'index'},
    },
    {
      method: 'GET',
      path: '/entity/{entityId}',
      config: {
        validate: {
          params: {
            entityId: Joi.number().only(validParams.entityIds).required(),
          },
          failAction: to404,
        },
      },
      handler: {view: 'index'},
    },
    {
      method: 'GET',
      path: '/source/{sourceId}',
      config: {
        validate: {
          params: {
            sourceId: Joi.number().only(validParams.sources).required(),
          },
          failAction: to404,
        },
      },
      handler: {view: 'index'},
    },
    {
      method: 'GET',
      path: '/usagetype/{usageType}',
      config: {
        validate: {
          params: {
            usageType: Joi.string().only(validParams.usageTypes)
            .insensitive().required(),
          },
          failAction: to404,
        },
      },
      handler: {view: 'index'},
    },
    {
      method: 'GET',
      path: '/project/{projectId}',
      config: {
        validate: {
          params: {
            projectId: Joi.number().only(validParams.projects).required(),
          },
          failAction: to404,
        },
      },
      handler: {view: 'index'},
    },
    {
        method: 'GET',
        path: '/wms/{wmsId}',
        config: {
            validate: {
                params: {
                    wmsId: Joi.number().only(validParams.wms).required(),
                },
                failAction: to404
            },
        },
        handler: {view: 'index'}
    },
    {
        method: 'GET',
        path: '/wmstype/{wmsType}',
        config: {
            validate: {
                params: {
                    wmsType: Joi.string().only(validParams.wmsType).insensitive().required(),
                },
                failAction: to404
            }
        },
        handler: {view: 'index'}
    },
    {
      method: 'GET',
      path: '/about',
      handler: {view: 'about'},
    },
    {
      method: 'GET',
      path: '/humans.txt',
      handler: {
        file: {
          path: path.normalize(__dirname + '../../public/static/humans.txt'),
        },
      },
    },
    {
      method: 'GET',
      path: '/robots.txt',
      handler: (request, reply) => {
        // serve blank (allow-all) robots.txt when in production
        if (process.env.NODE_ENV === 'production') {
          reply('');
        } else {
          reply.file(
            path.normalize(__dirname + '../../public/static/nobots.txt'));
        }
      },
    },
  ];

  addRoutes(server, routes, basePath);
}

export default {
  addTo,
};
