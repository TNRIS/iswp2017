
import alt from '../alt';
import CdbUtil from '../utils/CdbUtil';
import IntersectingRegionsActions from '../actions/IntersectingRegionsActions';

export const IntersectingRegionsSource = {
  // "fetch" will become a method on IntersectingRegionsStore --> IntersectingRegionsStore.fetch({type, typeId})
  fetch: {
    remote(state, countyName) {
      return CdbUtil.getIntersectingRegions(countyName);
    },

    local() {
      return null;
    },

    success: IntersectingRegionsActions.updateIntersectingRegions,
    error: IntersectingRegionsActions.fetchIntersectingRegionsFailed,
    loading: IntersectingRegionsActions.fetchIntersectingRegions
  }
};

class IntersectingRegionsStore {
  constructor() {
    this.intersectingRegions = null;
    this.errorMessage = null;

    this.registerAsync(IntersectingRegionsSource);

    this.bindListeners({
      handleUpdate: IntersectingRegionsActions.UPDATE_INTERSECTING_REGIONS,
      handleFetch: IntersectingRegionsActions.FETCH_INTERSECTING_REGIONS,
      handleFetchFailed: IntersectingRegionsActions.FETCH_INTERSECTING_REGIONS_FAILED
    });
  }

  handleUpdate(intersectingRegions) {
    this.intersectingRegions = intersectingRegions;
  }

  handleFetch() {
    this.intersectingRegions = null;
    this.errorMessage = null;
  }

  handleFetchFailed(errorMessage) {
    this.errorMessage = errorMessage;
  }
}

export default alt.createStore(IntersectingRegionsStore, 'IntersectingRegionsStore');