
import Joi from 'joi';

import constants from 'lib/constants';
import DataController from 'controllers/data';

const dataController = new DataController();
const bind = (method) => dataController[method].bind(dataController);

const omitRowsNote = 'Setting the query string to <code>omitRows=true</code>' +
                     'will omit raw data rows.';

/**
 * Create API routes
 * @param {object} validParams
 * @return {array} array of routes
 */
export default function generateRoutes(validParams) {
  const validCounties = validParams.counties;
  const validRegions = validParams.regions;
  const validEntityIds = validParams.entityIds;
  const validUsageTypes = validParams.usageTypes;
  const validProjects = validParams.projects;
  const validSources = validParams.sources;
  const validWmsIds = validParams.wms;
  const validWmsTypes = validParams.wmsType;
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
            regionLetter:
              Joi.string().only(validRegions).insensitive().required()
          },
          query: {
            omitRows: Joi.boolean()
          },
        },
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        },
        description: 'Get water planning data and summaries ' +
                     'for the region identified by {regionLetter}.',
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
            countyName:
              Joi.string().only(validCounties).insensitive().required()
          },
          query: {
            omitRows: Joi.boolean()
          },
        },
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        },
        description: 'Get water planning data and summaries for the ' +
                     'county identified by {countyName}.',
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
        description: 'Get water planning data and summaries for the ' +
                     'entity identified by {entityId}.',
        notes: omitRowsNote
      },
      handler: bind('getForEntity')
    },
    {
      method: 'GET',
      path: '/data/source/{sourceId}',
      config: {
        validate: {
          params: {
            sourceId: Joi.number().only(validSources).required()
          },
          query: {
            omitRows: Joi.boolean()
          }
        },
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        },
        description: 'Get water source data and summaries for the ' +
                     'water source identified by {sourceId}.',
        notes: omitRowsNote
      },
      handler: bind('getForSource')
    },
    {
      method: 'GET',
      path: '/data/usagetype/{usageType}',
      config: {
        validate: {
          params: {
            usageType:
              Joi.string().only(validUsageTypes).insensitive().required()
          },
          query: {
            omitRows: Joi.boolean()
          }
        },
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        },
        description: 'Get water planning data and summaries for all entities ' +
                     'of the usage type identified by {usageType}.',
        notes: omitRowsNote
      },
      handler: bind('getForUsageType')
    },
    {
      method: 'GET',
      path: '/data/project/{projectId}',
      config: {
        validate: {
          params: {
            projectId: Joi.number().only(validProjects).required()
          },
          query: {
            omitRows: Joi.boolean()
          }
        },
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        },
        description: 'Get project data and summaries for the ' +
                     'project identified by {projectId}.',
        notes: omitRowsNote
      },
      handler: bind('getForProject')
    },
      {
      method: 'GET',
      path: '/data/wms/{wmsId}',
      config: {
        validate: {
          params: {
            wmsId: Joi.number().only(validWmsIds).required()
          },
          query: {
            omitRows: Joi.boolean()
          }
        },
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        },
        description: 'Get WMS data based on WMS Id.',  /* TODO: Update description **/
        notes: omitRowsNote
      },
      handler: bind('getForWMS')
    }, {
      method: 'GET',
      path: '/data/wmstype/{wmsType}',
      config: {
        validate: {
          params: {
            wmsType: Joi.string().only(validWmsTypes).required()
          },
          query: {
            omitRows: Joi.boolean()
          }
        },
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        },
        description: 'Get WMS type data based on WMS Type.',
        notes: omitRowsNote
      },
      handler: bind('getForWmsType')
    }
  ];
}
