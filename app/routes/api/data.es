
import Joi from 'joi';

import constants from 'lib/constants';
import DataController from 'controllers/data';

const dataController = new DataController();
const bind = (method) => dataController[method].bind(dataController);

const routes = [
  {
    method: 'GET',
    path: '/data/{year}/region/{regionLetter}',
    config: {
      validate: {
        params: {
          year: Joi.string().only(constants.YEARS).required(),
          regionLetter: Joi.string().only(constants.REGIONS).insensitive().required()
        }
      },
      cache: {
        expiresIn: constants.API_CACHE_EXPIRES_IN
      }
    },
    handler: bind('getForRegion')
  },
  {
    method: 'GET',
    path: '/data/{year}/county/{county}',
    config: {
      validate: {
        params: {
          year: Joi.string().only(constants.YEARS).required(),
          county: Joi.string().required()
        }
      },
      cache: {
        expiresIn: constants.API_CACHE_EXPIRES_IN
      }
    },
    handler: bind('getForCounty')
  },
  {
    method: 'GET',
    path: '/data/{year}/entity/{entityId}',
    config: {
      validate: {
        params: {
          year: Joi.string().only(constants.YEARS).required(),
          entityId: Joi.number().integer().required()
        }
      },
      cache: {
        expiresIn: constants.API_CACHE_EXPIRES_IN
      }
    },
    handler: bind('getForEntity')
  }
];

export default routes;

