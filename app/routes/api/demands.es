
import R from 'ramda';
import Joi from 'joi';

import db from '../../db';
import constants from '../../lib/constants';

const theme = 'demands';

const renameValCol = (year) => `${constants.VALUE_PREFIXES[theme]}${year} as Value_${year}`;

const commonSelectArgs = [
  'EntityId as EntityId', 'EntityName', 'WugType', 'WugRegion', 'WugCounty'
];

const defaultValueArgs = R.map(renameValCol)(constants.YEARS);

const makeSelectArgs = (params) => {
  return params.year ? R.append(renameValCol(params.year), commonSelectArgs)
    : R.concat(commonSelectArgs, defaultValueArgs);
};

const routes = [
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
    handler: (request, reply) => {
      const selectArgs = makeSelectArgs(request.params);
      db.select.apply(db, selectArgs)
        .from('vwMapWugDemand')
        .then((results) => {
          reply(results);
        });
    }
  }
];

export default routes;