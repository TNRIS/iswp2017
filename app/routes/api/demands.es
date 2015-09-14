
import R from 'ramda';
import Joi from 'joi';

import db from '../../db';
import constants from '../../lib/constants';

const theme = 'demands';
const valKeys = R.map(R.concat(constants.VALUE_PREFIXES[theme]))(constants.YEARS);

// TODO: separate handlers from routes for testing

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
      db.select('EntityId as EntityId', 'EntityName', 'WugType', 'WugRegion',
        'WugCounty', 'D2020', 'D2030', 'D2040', 'D2050', 'D2060')
        .from('vwMapWugDemand')
        .then((results) => {
          if (request.params.year) {
            const rowsWithValue = results.map((row) => {
              const rowWithValue = R.assoc('Value', R.prop('D2020', row))(row);
              return R.omit(valKeys, rowWithValue);
            });
            return reply(rowsWithValue);
          }
          reply(results);
        });
    }
  }
];

export default routes;