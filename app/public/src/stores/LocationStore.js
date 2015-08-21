import Immutable from 'immutable';

import alt from '../alt';
import LocationActions from '../actions/LocationActions';
import FavoritesStore from '../stores/FavoritesStore';

class LocationStore {
  constructor() {
    this.locations = Immutable.List();
    this.errorMessage = null;

    this.bindListeners({
      handleUpdateLocations: LocationActions.UPDATE_LOCATIONS,
      handleFetchLocations: LocationActions.FETCH_LOCATIONS,
      handleLocationsFailed: LocationActions.LOCATIONS_FAILED,
      setFavorites: LocationActions.FAVORITE_LOCATION
    });
  }

  handleUpdateLocations(locations) {
    this.locations = locations;
  }

  handleFetchLocations() {
    this.locations = Immutable.List();
  }

  handleLocationsFailed(errorMessage) {
    this.errorMessage = errorMessage;
  }

  resetAllFavorites() {
    this.locations = this.locations.map((location) => {
      return Immutable.fromJS({
        id: location.id,
        name: location.name,
        has_favorite: false
      });
    });
  }

  setFavorites() {
    this.waitFor(FavoritesStore);

    let favoritedLocations = FavoritesStore.getState().locations;

    this.resetAllFavorites();

    favoritedLocations.forEach((faveLocation) => {
      for (let i=0; i<this.locations.size; i++) {
        if (this.locations[i].get('id') === faveLocation.get('id')) {
          this.locations[i] = this.locations[i].set('has_favorite', true);
          break;
        }
      }
    });
  }
}

export default alt.createStore(LocationStore, 'LocationStore');
