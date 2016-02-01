
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
        },
        description: 'Get all water user group entities.',
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
        },
        description: 'Get the water user group entity identified by {entityId}.'
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
        },
        //no cache for search
        description: 'Find a water user group entity by name or partial name.',
        notes: 'Use the <code>name={nameOrPartial}</code> query parameter to provide a name or partial name.'
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
        },
        description: 'Get all water user group entities in the region identified by {regionLetter}.'
      },
      handler: bind('getInRegion')
    },
    {
      method: 'GET',
      path: '/entities/county/{countyName}',
      config: {
        validate: {
          params: {
            countyName: Joi.string().only(validCounties).insensitive().required()
          }
        },
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        },
        description: 'Get all water user group entities in the county identified by {countyName}.'
      },
      handler: bind('getInCounty')
    }
  ];
}