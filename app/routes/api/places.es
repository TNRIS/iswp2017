import Joi from 'joi';

import constants from 'lib/constants';
import PlacesController from 'controllers/places';

const placesController = new PlacesController();
const bind = (method) => placesController[method].bind(placesController);

export default function generateRoutes(validParams) {
  const validCounties = validParams.counties;
  return [{
    method: 'GET',
    path: '/places/county/{county}/regions',
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
    handler: bind('getRegionsForCounty')
  }];
}