
import R from 'ramda';
import Joi from 'joi';

import constants from 'lib/constants';
import DownloadController from 'controllers/download';
import utils from 'lib/utils';

const downloadController = new DownloadController();
const bind = (method) => downloadController[method].bind(downloadController);

function addTo(server, basePath = '/') {
  const validParams = server.plugins.validParameters;
  if (!validParams) {
    throw new Error('validParameters must be loaded before adding download routes');
  }

  const themes = R.keys(constants.DATA_TABLES);

  const routes = [
    {
      method: 'GET',
      path: '/entities',
      handler: bind('getEntitiesCsv')
    },
    {
      method: 'GET',
      path: '/statewide/{theme}',
      config: {
        validate: {
          params: {
            theme: Joi.string().only(themes).insensitive().required()
          }
        }
      },
      handler: bind('getThemeCsv')
    },
    {
      method: 'GET',
      path: '/region/{regionLetter}/{theme}',
      config: {
        validate: {
          params: {
            theme: Joi.string().only(themes).insensitive().required(),
            regionLetter: Joi.string().only(validParams.regions).insensitive().required()
          },
        }
      },
      handler: bind('getRegionCsv')
    },
    {
      method: 'GET',
      path: '/county/{countyName}/{theme}',
      config: {
        validate: {
          params: {
            theme: Joi.string().only(themes).insensitive().required(),
            countyName: Joi.string().only(validParams.counties).insensitive().required()
          }
        }
      },
      handler: bind('getCountyCsv')
    },
    {
      method: 'GET',
      path: '/entity/{entityId}/{theme}',
      config: {
        validate: {
          params: {
            theme: Joi.string().only(themes).insensitive().required(),
            entityId: Joi.number().only(validParams.entityIds).required()
          }
        }
      },
      handler: bind('getEntityCsv')
    },
    {
      method: 'GET',
      path: '/usagetype/{usageType}/{theme}',
      config: {
        validate: {
          params: {
            theme: Joi.string().only(themes).insensitive().required(),
            usageType: Joi.string().only(validParams.usageTypes).insensitive().required()
          }
        }
      },
      handler: bind('getUsageTypeCsv')
    }
  ];

  utils.addRoutes(server, routes, basePath);
}

export default {
  addTo
};