
import Joi from 'joi';

import constants from 'lib/constants';
import utils from 'lib/utils';
import PlanningDataController from 'controllers/planningData';

const demandsController = new PlanningDataController(
  {theme: 'demands', table: 'vwMapWugDemand'}
);

const routes = [
  {
    path: '/demands/{year?}',
    params: {
      year: Joi.string().only(constants.YEARS)
    },
    handler: 'getAll'
  },
  {
    path: '/demands/{year}/region/{regionLetter}',
    params: {
      year: Joi.string().only(constants.YEARS).required(),
      regionLetter: Joi.string().only(constants.REGIONS).insensitive().required()
    },
    handler: 'getForRegion'
  },
  {
    path: '/demands/{year}/county/{county}',
    params: {
      year: Joi.string().only(constants.YEARS).required(),
      county: Joi.string().required() // TODO: Validate
    },
    handler: 'getForCounty'
  },
  {
    path: '/demands/{year}/type/{type}',
    params: {
      year: Joi.string().only(constants.YEARS).required(),
      type: Joi.string().required() // TODO: Validate
    },
    handler: 'getForType'
  },
  {
    path: '/demands/{year}/entity/{entityId}',
    params: {
      year: Joi.string().only(constants.YEARS).required(),
      entityId: Joi.number().integer().required() // TODO: Validate
    },
    handler: 'getForEntity'
  }
];

export default utils.toHapiRoutes(routes, demandsController);