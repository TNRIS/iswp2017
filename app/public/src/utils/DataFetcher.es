
import axios from 'axios';

import constants from '../constants';
import history from '../history';

function fetchData({type, typeId}) {
  if (!type || (type !== 'statewide' && !typeId)) {
    throw new Error('Missing required parameters');
  }

  let uri = `${constants.API_BASE}/data/${type}`;

  if (type === 'statewide') {
    uri += '?omitRows=true';
  }

  if (typeId) {
    uri += `/${typeId}`;
  }

  return axios.get(uri)
    .then((response) => response.data)
    .catch(() => {
      //redirect to default view on fetch error
      history.push({pathname: '/'});
    });
}

export default {
  fetch: (params) => {
    return fetchData(params);
  }
};
