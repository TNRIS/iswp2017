
import Joi from 'joi';

import utils from 'lib/utils';
import EntitiesController from 'controllers/entities';

const entitiesController = new EntitiesController();

const routeConfigs = [
  {
    path: '/entities',
    handler: 'getAll'
  },
  {
    path: '/entities/{entityId}',
    params: {
      entityId: Joi.number().integer().required()
    },
    handler: 'getOne'
  },
  {
    path: '/entities/{entityId}/summary',
    params: {
      entityId: Joi.number().integer().required()
    },
    handler: 'getEntitySummary'
  },
  {
    path: '/entities/search',
    query: {
      name: Joi.string().min(3).required()
    },
    handler: 'getByNamePartial'
  }
];

export default utils.toHapiRoutes(routeConfigs, entitiesController);