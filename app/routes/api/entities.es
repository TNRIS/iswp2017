
import Joi from 'joi';

import constants from 'lib/constants';
import EntitiesController from 'controllers/entities';

const entitiesController = new EntitiesController();
const bind = (method) => entitiesController[method].bind(entitiesController);

const routes = [
  {
    method: 'GET',
    path: '/entities',
    config: {
      cache: {
        expiresIn: constants.API_CACHE_EXPIRES_IN
      }
    },
    handler: bind('getAll')
  },
  {
    method: 'GET',
    path: '/entities/{entityId}',
    config: {
      validate: {
        params: {
          entityId: Joi.number().integer().required()
        }
      },
      cache: {
        expiresIn: constants.API_CACHE_EXPIRES_IN
      }
    },
    handler: bind('getOne')
  },
  {
    method: 'GET',
    path: '/entities/{entityId}/summary',
    config: {
      validate: {
        params: {
          entityId: Joi.number().integer().required()
        }
      },
      cache: {
        expiresIn: constants.API_CACHE_EXPIRES_IN
      }
    },
    handler: bind('getEntitySummary')
  },
  {
    method: 'GET',
    path: '/entities/search',
    config: {
      validate: {
        query: {
          name: Joi.string().min(3).required()
        }
      },
      cache: {
        expiresIn: constants.API_CACHE_EXPIRES_IN
      }
    },
    handler: bind('getByNamePartial')
  }
];

export default routes;