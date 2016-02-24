
import axios from 'axios';

import constants from '../constants';
import alt from '../alt';
import ParentPlaceActions from '../actions/ParentPlaceActions';

export const ParentPlaceSource = {
  // "fetch" will become a method on ParentPlaceStore --> ParentPlaceStore.fetch({type, typeId})
  fetch: {
    remote(state, type, typeId) {
      if (type === 'county') {
        return axios.get(`${constants.API_BASE}/places/county/${typeId}/regions`)
          .then(({data}) => data);
      }
      else if (type === 'entity') {
        return axios.get(`${constants.API_BASE}/places/entity/${typeId}/counties`)
          .then(({data}) => data);
      }

      throw new Error('Only county and entity are allowable in ParentPlaceSource.fetch');
    },

    local() {
      return null;
    },

    success: ParentPlaceActions.updateParentPlace,
    error: ParentPlaceActions.fetchParentPlaceFailed,
    loading: ParentPlaceActions.fetParentPlace
  }
};

class ParentPlaceStore {
  constructor() {
    this.parentPlaces = null;
    this.errorMessage = null;

    this.registerAsync(ParentPlaceSource);

    this.bindListeners({
      handleUpdate: ParentPlaceActions.UPDATE_PARENT_PLACE,
      handleFetch: ParentPlaceActions.FETCH_PARENT_PLACE,
      handleFetchFailed: ParentPlaceActions.FETCH_PARENT_PLACE_FAILED
    });
  }

  handleUpdate(parentPlaces) {
    this.parentPlaces = parentPlaces;
  }

  handleFetch() {
    this.parentPlaces = null;
    this.errorMessage = null;
  }

  handleFetchFailed(errorMessage) {
    this.errorMessage = errorMessage;
  }
}

export default alt.createStore(ParentPlaceStore, 'ParentPlaceStore');