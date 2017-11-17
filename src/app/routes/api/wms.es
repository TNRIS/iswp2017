import Joi from 'joi';

import constants from 'lib/constants';
import WMSController from 'controllers/wms';

const wmsController = new WMSController();
const bind = (method) => wmsController[method].bind(wmsController);

export default function generateRoutes(validParams) {
  const validWMS = validParams.wms;
  return [
    {
      method: 'GET',
      path: '/wms',
      config: {
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        },
        description: 'Get all wmses',
      },
      handler: bind('getAll')
    },
    {
      method: 'GET',
      path: '/wms/{WmsId}',
      config: {
        validate: {
          params: {
            WmsId: Joi.number().only(validWMS).required()
          }
        },
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        },
        description: 'Get one wms.'
      },
      handler: bind('getOne')
    },
    {
      method: 'GET',
      path: '/wms/search',
      config: {
        validate: {
          query: {
            name: Joi.string().min(3).required()
          }
        },
        description: 'Get WMS by name.'
      },
      handler: bind('getByNamePartial')
    }
  ];
}
