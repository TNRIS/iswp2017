
import xhr from 'xhr';
import Immutable from 'immutable';
import constants from '../constants';

export default {
  fetch: ({theme, year, type, typeId}) => {
    return new Promise((resolve, reject) => {
      let uri = `//${constants.API_BASE}/${theme}/${type}/`;
      if (typeId) { uri += typeId; }
      xhr({
        json: true,
        uri: uri
      }, (err, res, body) => {
        if (err) {
          reject(err);
        }
        else {
          // TODO: filter by year
          resolve(Immutable.fromJS(body));
        }
      });
    });
  }
};
