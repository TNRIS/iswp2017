
import Joi from 'joi';

import constants from 'lib/constants';
import DataController from 'controllers/data';

const dataController = new DataController();
const bind = (method) => dataController[method].bind(dataController);

const omitRowsNote = 'Setting the query string to <code>omitRows=true</code> will omit raw data rows.';

export default function generateRoutes(validParams) {
  const validCounties = validParams.counties;
  const validRegions = validParams.regions;
  const validEntityIds = validParams.entityIds;
  const validUsageTypes = validParams.usageTypes;
  return [
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
        },
        description: 'Get all water planning data and summaries.',
        notes: omitRowsNote
      },
      handler: bind('getForState')
    },
    {
      method: 'GET',
      path: '/data/statewide/regionalsummary',
      config: {
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        },
        description: 'Get regional summary data by water usage type.'
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
          },
        },
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        },
        description: 'Get water planning data and summaries for the region identified by {regionLetter}.',
        notes: omitRowsNote
      },
      handler: bind('getForRegion')
    },
    {
      method: 'GET',
      path: '/data/county/{countyName}',
      config: {
        validate: {
          params: {
            countyName: Joi.string().only(validCounties).insensitive().required()
          },
          query: {
            omitRows: Joi.boolean()
          },
        },
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        },
        description: 'Get water planning data and summaries for the county identified by {countyName}.',
        notes: omitRowsNote
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
        },
        description: 'Get water planning data and summaries for the entity identified by {entityId}.',
        notes: omitRowsNote
      },
      handler: bind('getForEntity')
    },
    {
      method: 'GET',
      path: '/data/usagetype/{usageType}',
      config: {
        validate: {
          params: {
            usageType: Joi.string().only(validUsageTypes).insensitive().required()
          },
          query: {
            omitRows: Joi.boolean()
          }
        },
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        },
        description: 'Get water planning data and summaries for all entities of the usage type identified by {usageType}.',
        notes: omitRowsNote
      },
      handler: bind('getForUsageType')
    }
  ];
}
