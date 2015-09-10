
import xhr from 'xhr';

import constants from '../constants';

export default {
  // TODO: This should take theme params and the server API
  // should return the entities according to that theme
  // Currently it returns all entities.
  fetch: () => {
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
          resolve(body);
        }
      });
    });
  }
};
