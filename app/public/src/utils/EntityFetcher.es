
import R from 'ramda';
import axios from 'axios';

import constants from '../constants';

export default {
  /**
  *
  * @param {String} entityId the id of the entity
  *
  */
  fetch: ({entityId}) => {
    if (!entityId) {
      throw new Error("entityId is required");
    }

    let uri = `${constants.API_BASE}/entities/${entityId}`;

    return axios.get(uri).then((response) => {
      return R.nth(0, response.data);
    });
  },

  search: (name) => {
    if (name.length < 3) {
      throw new Error("name must be at least 3 characters");
    }

    let uri = `${constants.API_BASE}/entities/search?name=${name}`;
    return axios.get(uri).then(({data}) => data);
  }
};
