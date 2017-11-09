
import R from 'ramda';
import axios from 'axios';

import constants from '../constants';

export default {
  /**
  *
  * @param {String} WMSId the id of the wms
  *
  */
  fetch: ({WMSId}) => {
    if (!WMSId) {
      throw new Error("WMSId is required");
    }

    let uri = `${constants.API_BASE}/wms/${WMSId}`;

    return axios.get(uri).then((response) => {
      return R.nth(0, response.data);
    });
  },

  search: (name) => {
    if (name.length < 3) {
      throw new Error("name must be at least 3 characters");
    }

    let uri = `${constants.API_BASE}/wms/search?name=${name}`;
    return axios.get(uri).then(({data}) => data);
  }
};
