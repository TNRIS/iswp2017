
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
      path: '/usagetype/{usageType}',
      config: {
        validate: {
          params: {
            //TODO: validate usageType .only(validParams.usageTypes)
            usageType: Joi.string().required()
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
        //serve blank (allow-all) robots.txt for production hostname
        if (request.info.hostname.indexOf('texasstatewaterplan.org') !== -1) {
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