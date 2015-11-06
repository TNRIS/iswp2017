import alt from '../alt';
// import PlaceDataFetcher from '../utils/PlaceDataFetcher';

class PlaceDataActions {
  //called once placeData has been successfully fetched
  updatePlaceData(placeData) {
    this.dispatch(placeData);
  }

  //called on start of fetch
  fetchPlaceData() {
    this.dispatch();
  }

  //called on fetch error
  fetchPlaceDataFailed(error) {
    // TODO: Better error message generation
    this.dispatch(error.toString());
  }
}

export default alt.createActions(PlaceDataActions);