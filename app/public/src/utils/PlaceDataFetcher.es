import xhr from 'xhr';

import constants from '../constants';

export default {
  fetch: ({year, type, typeId}) => {
    return new Promise((resolve, reject) => {
      if (!year || !type || !typeId) {
        reject(new Error('Missing required parameters'));
        return;
      }

      const uri = `${constants.API_BASE}/data/${year}/${type}/${typeId}`;

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