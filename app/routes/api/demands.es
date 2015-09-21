
import Joi from 'joi';

import constants from 'lib/constants';
import utils from 'lib/utils';
import demandsController from 'controllers/demands';

const routes = [
  {
    path: '/demands/{year?}',
    params: {
      year: Joi.string().only(constants.YEARS)
    },
    handler: 'getDemands'
  },
  {
    path: '/demands/{year}/region/{regionLetter}',
    params: {
      year: Joi.string().only(constants.YEARS).required(),
      regionLetter: Joi.string().only(constants.REGIONS).insensitive().required()
    },
    handler: 'getDemandsForRegion'
  },
  {
    path: '/demands/{year}/county/{county}',
    params: {
      year: Joi.string().only(constants.YEARS).required(),
      county: Joi.string().required() // TODO: Validate
    },
    handler: 'getDemandsForCounty'
  },
  {
    path: '/demands/{year}/type/{type}',
    params: {
      year: Joi.string().only(constants.YEARS).required(),
      type: Joi.string().required() // TODO: Validate
    },
    handler: 'getDemandsForType'
  },
  {
    path: '/demands/{year}/entity/{entityId}',
    params: {
      year: Joi.string().only(constants.YEARS).required(),
      entityId: Joi.number().integer().required()
    },
    handler: 'getDemandsForEntity'
  }
];

export default utils.toHapiRoutes(routes, demandsController);