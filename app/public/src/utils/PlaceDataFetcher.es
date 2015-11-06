
import axios from 'axios';

import constants from '../constants';
import BoundaryFetcher from './BoundaryFetcher';

function fetchData({type, typeId}) {
  if (!type || !typeId) {
    throw new Error('Missing required parameters');
  }

  const uri = `${constants.API_BASE}/data/${type}/${typeId}`;
  return axios.get(uri).then((response) => response.data);
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