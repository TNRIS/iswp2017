import alt from '../alt';
import LocationsFetcher from '../utils/LocationsFetcher';

class LocationActions {
  updateLocations(locations) {
    this.dispatch(locations);
  }

  favoriteLocation(locationId) {
    this.dispatch(locationId);
  }

  fetchLocations() {
    this.dispatch();
    LocationsFetcher.fetch()
      .then((locations) => {
        this.actions.updateLocations(locations);
      })
      .catch((errorMessage) => {
        this.actions.locationsFailed(errorMessage);
      });
  }

  locationsFailed(errorMessage) {
    this.dispatch(errorMessage);
  }
}

export default alt.createActions(LocationActions);
