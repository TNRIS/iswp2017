import Joi from 'joi';

import constants from 'lib/constants';
import PlacesController from 'controllers/places';

const placesController = new PlacesController();
const bind = (method) => placesController[method].bind(placesController);

export default function generateRoutes(validParams) {
  const validCounties = validParams.counties;
  const validEntityIds = validParams.entityIds;

  return [
    {
      method: 'GET',
      path: '/places/county/{countyName}/regions',
      config: {
        validate: {
          params: {
            countyName: Joi.string().only(validCounties).insensitive().required()
          }
        },
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        },
        description: 'Get the list of regions that contain the county identified by {countyName}'
      },
      handler: bind('getRegionsForCounty')
    },
    {
      method: 'GET',
      path: '/places/entity/{entityId}/counties',
      config: {
        validate: {
          params: {
            entityId: Joi.number().only(validEntityIds).required()
          }
        },
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        },
        description: 'Get the list of counties that contain the entity identified by {entityId}'
      },
      handler: bind('getCountiesForEntity')
    },
    {
      method: 'GET',
      path: '/places/entity/{entityId}/regions',
      config: {
        validate: {
          params: {
            entityId: Joi.number().only(validEntityIds).required()
          }
        },
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        },
        description: 'Get the list of regions that contain the entity identified by {entityId}'
      },
      handler: bind('getRegionsForEntity')
    }
  ];
}