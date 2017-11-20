
import alt from '../alt';
import PlaceDataActions from '../actions/PlaceDataActions';
import DataFetcher from '../utils/DataFetcher';
import BoundaryFetcher from '../utils/BoundaryFetcher';

export const PlaceDataSource = {
  // "fetch" will become a method on PlaceDataStore --> PlaceDataStore.fetch({type, typeId})
  fetch: {
    remote(state, params) {
      return Promise.all([
        DataFetcher.fetch(params),
        BoundaryFetcher.fetch(params)
      ]).then(([data, boundary]) => {
        return {data, boundary};
      });
    },

    success: PlaceDataActions.updatePlaceData,
    error: PlaceDataActions.fetchPlaceDataFailed,
    loading: PlaceDataActions.fetchPlaceData
  }
};

class PlaceDataStore {
  constructor() {
    this.placeData = {};
    this.errorMessage = null;

    this.registerAsync(PlaceDataSource);

    this.bindListeners({
      handleUpdatePlaceData: PlaceDataActions.UPDATE_PLACE_DATA,
      handleFetchPlaceData: PlaceDataActions.FETCH_PLACE_DATA,
      handleFetchPlaceDataFailed: PlaceDataActions.FETCH_PLACE_DATA_FAILED
    });
  }

  handleUpdatePlaceData(placeData) {
    this.placeData = placeData;
  }

  handleFetchPlaceData() {
    //reset to new empty object during fetch
    this.placeData = {};
    this.errorMessage = null;
  }

  handleFetchPlaceDataFailed(errorMessage) {
    this.errorMessage = errorMessage;
  }
}

export default alt.createStore(PlaceDataStore, 'PlaceDataStore');