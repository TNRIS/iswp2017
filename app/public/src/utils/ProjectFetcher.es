
import R from 'ramda';
import axios from 'axios';

import constants from '../constants';

export default {
  /**
  *
  * @param {String} projectId the id of the project
  *
  */
  fetch: ({projectId}) => {
    if (!projectId) {
      throw new Error("projectId is required");
    }

    let uri = `${constants.API_BASE}/projects/${projectId}`;

    return axios.get(uri).then((response) => {
      return R.nth(0, response.data);
    });
  },

  search: (name) => {
    if (name.length < 3) {
      throw new Error("name must be at least 3 characters");
    }

    let uri = `${constants.API_BASE}/projects/search?name=${name}`;
    return axios.get(uri).then(({data}) => data);
  }
};
