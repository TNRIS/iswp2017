import axios from 'axios';

import constants from '../constants';

export default {
  /**
  *
  * @param {String} wmsType the type of wms
  *
  */
  fetch: ({wmsType}) => {
    if (!wmsType) {
      throw new Error("wmsType is required");
    }

    let uri = `${constants.API_BASE}/wmstype/${wmsType}`;
    console.log(uri);
    return axios.get(uri).then(({data}) => data);
  }
};
