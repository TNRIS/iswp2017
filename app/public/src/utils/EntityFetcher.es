
import R from 'ramda';
import xhr from 'xhr';

import constants from '../constants';

export default {
  fetch: ({entityIds = null} = {}) => {
    return new Promise((resolve, reject) => {
      const uri = `//${constants.API_BASE}/entity/`;

      xhr({
        json: true,
        uri: uri
      }, (err, res, body) => {
        if (err) {
          reject(err);
        }
        else {
          if (entityIds) {
            const filtered = R.filter(R.where({EntityId: R.contains(R.__, entityIds)}))(body);
            resolve(filtered);
          }
          else {
            resolve(body);
          }
        }
      });
    });
  }
};
