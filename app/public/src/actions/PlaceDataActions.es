import alt from '../alt';
import PlaceDataFetcher from '../utils/PlaceDataFetcher';

class PlaceDataActions {
  updatePlaceData(placeData) {
    this.dispatch(placeData);
  }

  fetchPlaceData(options) {
    this.dispatch();
    PlaceDataFetcher.fetch(options)
      .then((placeData) => {
        this.actions.updatePlaceData(placeData);
      })
      .catch((error) => {
        this.actions.fetchPlaceDataFailed(error);
      });
  }

  fetchPlaceDataFailed(error) {
    // TODO: Better error message generation
    this.dispatch(error.toString());
  }
}

export default alt.createActions(PlaceDataActions);