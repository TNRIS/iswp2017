
import axios from 'axios';

import constants from '../constants';

export default {
  /**
  *
  * @param {String} type the type of boundary to fetch ('region' or 'county')
  * @param {String} id the id of the boundary (like a region name or county name)
  *
  */
  fetch: ({type, typeId}) => {
    const uri = `${constants.API_BASE}/places/` +
      (type === 'region' ? `regions/${typeId}` : `counties/${typeId}`);
    return axios.get(uri).then((response) => response.data);
  }
};
