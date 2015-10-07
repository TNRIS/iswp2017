import Joi from 'joi';

import constants from 'lib/constants';
import PlacesController from 'controllers/places';

const placesController = new PlacesController();
const bind = (method) => placesController[method].bind(placesController);

const routes = [
  {
    method: 'GET',
    path: '/places/regions',
    config: {
      validate: {
        query: {
          f: Joi.string().only(['geojson', 'topojson']).optional()
        }
      },
      //TODO: ETags instead of cache expires
      cache: {
        expiresIn: constants.API_CACHE_EXPIRES_IN
      }
    },
    handler: bind('getRegions')
  },
  {
    method: 'GET',
    path: '/places/regions/{regionLetter}',
    config: {
      validate: {
        params: {
          regionLetter: Joi.string().length(1).required()
        }
      },
      cache: {
        expiresIn: constants.API_CACHE_EXPIRES_IN
      }
    },
    handler: bind('getRegion')
  },
  {
    method: 'GET',
    path: '/places/regions/names',
    config: {
      cache: {
        expiresIn: constants.API_CACHE_EXPIRES_IN
      }
    },
    handler: bind('getRegionLetters')
  },
  {
    method: 'GET',
    path: '/places/counties',
    config: {
      validate: {
        query: {
          f: Joi.string().only(['geojson', 'topojson']).optional()
        }
      },
      cache: {
        expiresIn: constants.API_CACHE_EXPIRES_IN
      }
    },
    handler: bind('getCounties')
  },
  {
    method: 'GET',
    path: '/places/counties/{countyName}',
    config: {
      validate: {
        params: {
          countyName: Joi.string().required()
        }
      },
      cache: {
        expiresIn: constants.API_CACHE_EXPIRES_IN
      }
    },
    handler: bind('getCounty')
  },
  {
    method: 'GET',
    path: '/places/counties/names',
    config: {
      cache: {
        expiresIn: constants.API_CACHE_EXPIRES_IN
      }
    },
    handler: bind('getCountyNames')
  }
];

export default routes;