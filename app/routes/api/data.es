
import Joi from 'joi';

import constants from 'lib/constants';
import DataController from 'controllers/data';

const dataController = new DataController();
const bind = (method) => dataController[method].bind(dataController);

export default function generateRoutes(validCounties, validRegions, validEntityIds) {
  return [
    {
      method: 'GET',
      path: '/data',
      config: {
        validate: {
          query: {
            omitRows: Joi.boolean()
          }
        },
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        }
      },
      handler: bind('getAll')
    },
    {
      method: 'GET',
      path: '/data/statewide',
      config: {
        validate: {
          query: {
            omitRows: Joi.boolean()
          }
        },
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        }
      },
      handler: bind('getForState')
    },
    {
      method: 'GET',
      path: '/data/statewide/regionalsummary',
      config: {
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        }
      },
      handler: bind('getRegionalSummaries')
    },
    {
      method: 'GET',
      path: '/data/region/{regionLetter}',
      config: {
        validate: {
          params: {
            regionLetter: Joi.string().only(validRegions).insensitive().required()
          },
          query: {
            omitRows: Joi.boolean()
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
      path: '/data/county/{county}',
      config: {
        validate: {
          params: {
            county: Joi.string().only(validCounties).insensitive().required()
          },
          query: {
            omitRows: Joi.boolean()
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
      path: '/data/entity/{entityId}',
      config: {
        validate: {
          params: {
            entityId: Joi.number().only(validEntityIds).required()
          },
          query: {
            omitRows: Joi.boolean()
          }
        },
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        }
      },
      handler: bind('getForEntity')
    }
  ];
}
