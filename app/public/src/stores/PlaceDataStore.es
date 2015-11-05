
import alt from '../alt';
import PlaceDataActions from '../actions/PlaceDataActions';
import PlaceDataSource from '../sources/PlaceDataSource';

class PlaceDataStore {
  constructor() {
    this.placeData = {};
    this.errorMessage = null;

    this.registerAsync(PlaceDataSource);

    this.bindListeners({
      handleUpdatePlaceData: PlaceDataActions.UPDATE_PLACE_DATA,
      // handleFetchPlaceData: PlaceDataActions.FETCH_PLACE_DATA,
      handleFetchPlaceDataFailed: PlaceDataActions.FETCH_PLACE_DATA_FAILED
    });
  }

  handleUpdatePlaceData(placeData) {
    this.placeData = placeData;
  }

  // handleFetchPlaceData() {
  //   //reset to new empty object during fetch
  //   this.placeData = {};
  //   this.errorMessage = null;
  // }

  handleFetchPlaceDataFailed(errorMessage) {
    this.errorMessage = errorMessage;
  }
}

export default alt.createStore(PlaceDataStore, 'PlaceDataStore');