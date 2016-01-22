
import Joi from 'joi';

import constants from 'lib/constants';
import EntitiesController from 'controllers/entities';

const entitiesController = new EntitiesController();
const bind = (method) => entitiesController[method].bind(entitiesController);

export default function generateRoutes(validParams) {
  const validCounties = validParams.counties;
  const validRegions = validParams.regions;
  const validEntityIds = validParams.entityIds;
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