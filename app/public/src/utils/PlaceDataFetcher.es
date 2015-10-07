import xhr from 'xhr';

import constants from '../constants';
import BoundaryFetcher from './BoundaryFetcher';


function fetchData({type, typeId}) {
  return new Promise((resolve, reject) => {
    if (!type || !typeId) {
      reject(new Error('Missing required parameters'));
      return;
    }

    const uri = `${constants.API_BASE}/data/${type}/${typeId}`;

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

export default {
  fetch: ({type, typeId}) => {
    return Promise.all([
      fetchData({type, typeId}),
      BoundaryFetcher.fetch({type, typeId})
    ]).then(([data, boundary]) => {
      return {
        data,
        boundary
      };
    });
  }
};