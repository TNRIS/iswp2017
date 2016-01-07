
import path from 'path';
import Joi from 'joi';

import utils from 'lib/utils';

function to404(request, reply) {
  return reply.view('404').code(404);
}

function add(server, basePath = '/') {
  const validParams = server.plugins.validParameters;
  if (!validParams) {
    throw new Error('validParameters must be loaded before adding api routes');
  }

  const routes = [
    {
      method: 'GET',
      path: '/',
      handler: (request, reply) => reply.view('index')
    },
    {
      method: 'GET',
      path: '/statewide',
      handler: (request, reply) => reply.view('index')
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
      handler: (request, reply) => reply.view('index')
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
      handler: (request, reply) => reply.view('index')
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
      handler: (request, reply) => reply.view('index')
    },
    {
      method: 'GET',
      path: '/about',
      handler: (request, reply) => reply.view('about')
    },
    {
      method: 'GET',
      path: '/robots.txt',
      handler: {
        file: {
          path: path.normalize(__dirname + '../../public/static/robots.txt')
        }
      }
    }
  ];

  utils.addRoutes(server, routes, basePath);
}

export default {
  add
};