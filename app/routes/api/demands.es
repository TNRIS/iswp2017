
import Joi from 'joi';

import constants from 'lib/constants';
import demandsController from 'controllers/demands';

export default [
  {
    method: 'GET',
    path: '/demands/{year?}',
    config: {
      validate: {
        params: {
          year: Joi.string().only(constants.YEARS)
        }
      }
    },
    handler: demandsController.getDemands
  }
];