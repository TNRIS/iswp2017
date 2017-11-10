
import Joi from 'joi';

import constants from 'lib/constants';
import SourcesController from 'controllers/sources';

const sourcesController = new SourcesController();
const bind = (method) => sourcesController[method].bind(sourcesController);

export default function generateRoutes(validParams) {
  const validSources = validParams.sources;
  return [
    {
      method: 'GET',
      path: '/sources',
      config: {
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        },
        description: 'Get all ground and surface water sources.',
      },
      handler: bind('getAll')
    },
    {
      method: 'GET',
      path: '/sources/{sourceId}',
      config: {
        validate: {
          params: {
            sourceId: Joi.number().only(validSources).required()
          }
        },
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        },
        description: 'Get the water source identified by {sourceId}.'
      },
      handler: bind('getOne')
    },
    {
      method: 'GET',
      path: '/sources/search',
      config: {
        validate: {
          query: {
            name: Joi.string().min(3).required()
          }
        },
        //no cache for search
        description: 'Find a ground or surface water source by name or partial name.',
        notes: 'Use the <code>name={nameOrPartial}</code> query parameter to provide a name or partial name.'
      },
      handler: bind('getByNamePartial')
    },
    {
      method: 'GET',
      path: '/sources/geojson',
      config: {
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        },
        description: 'Get all ground and surface water sources as multiple singlepart geometry records in a GeoJSON formatted response.',
      },
      handler: bind('getAllGeoJson')
    },
    {
      method: 'GET',
      path: '/sources/geojson/{sourceId}',
      config: {
        validate: {
          params: {
            sourceId: Joi.number().only(validSources).required()
          }
        },
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        },
        description: 'Get the water source identified by {sourceId} as multiple singlepart geometry records in a GeoJSON formatted response.'
      },
      handler: bind('getOneGeoJson')
    }
  ];
}