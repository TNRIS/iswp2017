
import Joi from 'joi';

import constants from 'lib/constants';
import demandsController from 'controllers/demands';

const bind = (fnName, ctrl) => ctrl[fnName].bind(ctrl);

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
    handler: bind('getDemands', demandsController)
  }
];