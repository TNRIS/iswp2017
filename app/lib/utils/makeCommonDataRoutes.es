
import Joi from 'joi';

import constants from 'lib/constants';

function makeCommonDataRoutes(controller) {
  const theme = controller.theme;
  const bind = (method) => controller[method].bind(controller);

  const routes = [
    {
      method: 'GET',
      path: `/${theme}/{year}/summary/region`,
      config: {
        validate: {
          params: {
            year: Joi.string().only(constants.YEARS).required()
          }
        },
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        }
      },
      handler: bind('getSummary')
    },
    //TODO: summary/county
    {
      method: 'GET',
      path: `/${theme}/{year?}`,
      config: {
        validate: {
          params: {
            year: Joi.string().only(constants.YEARS).optional()
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
      path: `/${theme}/{year}/region/{regionLetter}`,
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
      path: `/${theme}/{year}/county/{county}`,
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
      path: `/${theme}/{year}/type/{type}`,
      config: {
        validate: {
          params: {
            year: Joi.string().only(constants.YEARS).required(),
            type: Joi.string().required()
          }
        },
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        }
      },
      handler: bind('getForType')
    },
    {
      method: 'GET',
      path: `/${theme}/{year}/entity/{entityId}`,

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

  return routes;
}

export default makeCommonDataRoutes;