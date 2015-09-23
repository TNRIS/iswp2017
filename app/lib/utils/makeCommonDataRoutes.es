import Joi from 'joi';

import constants from 'lib/constants';
import toHapiRoutes from 'lib/utils/toHapiRoutes';

function makeCommonDataRoutes(controller) {
  const theme = controller.theme;
  const routes = [
    {
      path: `/${theme}/{year?}`,
      params: {
        year: Joi.string().only(constants.YEARS)
      },
      handler: 'getAll'
    },
    {
      path: `/${theme}/{year}/region/{regionLetter}`,
      params: {
        year: Joi.string().only(constants.YEARS).required(),
        regionLetter: Joi.string().only(constants.REGIONS).insensitive().required()
      },
      handler: 'getForRegion'
    },
    {
      path: `/${theme}/{year}/county/{county}`,
      params: {
        year: Joi.string().only(constants.YEARS).required(),
        county: Joi.string().required() // TODO: Validate
      },
      handler: 'getForCounty'
    },
    {
      path: `/${theme}/{year}/type/{type}`,
      params: {
        year: Joi.string().only(constants.YEARS).required(),
        type: Joi.string().required() // TODO: Validate
      },
      handler: 'getForType'
    },
    {
      path: `/${theme}/{year}/entity/{entityId}`,
      params: {
        year: Joi.string().only(constants.YEARS).required(),
        entityId: Joi.number().integer().required() // TODO: Validate
      },
      handler: 'getForEntity'
    }
  ]; 

  return toHapiRoutes(routes, controller);
}

export default makeCommonDataRoutes;