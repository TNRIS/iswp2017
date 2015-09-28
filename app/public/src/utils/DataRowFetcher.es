import xhr from 'xhr';

import constants from '../constants';

export default {
  fetch: ({theme, year, type, typeId}) => {
    return new Promise((resolve, reject) => {
      if (!theme || !type || !year) {
        reject(new Error('Missing required parameters'));
      }

      let uri = `${constants.API_BASE}/${theme}/${year}/${type}/`;
      if (typeId) { uri += typeId; }

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