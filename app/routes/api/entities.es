
import Joi from 'joi';

import constants from 'lib/constants';
import EntitiesController from 'controllers/entities';

const entitiesController = new EntitiesController();
const bind = (method) => entitiesController[method].bind(entitiesController);

export default function generateRoutes(validCounties, validRegions, validEntityIds) {
  return [
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
            entityId: Joi.number().only(validEntityIds).required()
          }
        },
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        }
      },
      handler: bind('getOne')
    },
    //TODO: Summary table does not exist yet
    // {
    //   method: 'GET',
    //   path: '/entities/{entityId}/summary',
    //   config: {
    //     validate: {
    //       params: {
    //         entityId: Joi.number().integer().required()
    //       }
    //     },
    //     cache: {
    //       expiresIn: constants.API_CACHE_EXPIRES_IN
    //     }
    //   },
    //   handler: bind('getEntitySummary')
    // },
    {
      method: 'GET',
      path: '/entities/search',
      config: {
        validate: {
          query: {
            name: Joi.string().min(3).required()
          }
        }
        //no cache for search
      },
      handler: bind('getByNamePartial')
    },
    {
      method: 'GET',
      path: '/entities/region/{regionLetter}',
      config: {
        validate: {
          params: {
            regionLetter: Joi.string().only(validRegions).insensitive().required()
          }
        },
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        }
      },
      handler: bind('getInRegion')
    },
    {
      method: 'GET',
      path: '/entities/county/{county}',
      config: {
        validate: {
          params: {
            county: Joi.string().only(validCounties).insensitive().required()
          }
        },
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        }
      },
      handler: bind('getInCounty')
    }
  ];
}