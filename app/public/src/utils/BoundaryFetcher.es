
import xhr from 'xhr';

import constants from '../constants';

export default {
  /**
  *
  * @param {String} type the type of boundary to fetch ('region' or 'county')
  * @param {String} id the id of the boundary (like a region name or county name)
  *
  */
  fetch: ({type, typeId}) => {
    return new Promise((resolve, reject) => {
      const uri = `${constants.API_BASE}/places/`;

      xhr({
        json: true,
        uri: uri + (type === 'region' ? `regions/${typeId}`
          : `counties/${typeId}`)
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
