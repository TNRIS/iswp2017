
import axios from 'axios';

import constants from '../constants';

//Fetches statewide summary
function fetch() {
  const uri = `${constants.API_BASE}/data/statewide/regionalsummary`;
  return axios.get(uri).then((response) => response.data);
}

export default {
  fetch
};