import alt from '../alt';
import LocationActions from '../actions/LocationActions';
import FavoritesStore from '../stores/FavoritesStore';

class LocationStore {
  constructor() {
    this.locations = [];
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
    this.locations = [];
  }

  handleLocationsFailed(errorMessage) {
    this.errorMessage = errorMessage;
  }

  resetAllFavorites() {
    this.locations = this.locations.map((location) => {
      return {
        id: location.id,
        name: location.name,
        has_favorite: false
      };
    });
  }

  setFavorites() {
    this.waitFor(FavoritesStore);

    let favoritedLocations = FavoritesStore.getState().locations;

    this.resetAllFavorites();

    favoritedLocations.forEach((faveLocation) => {
      for (let i=0; i<this.locations.length; i++) {
        if (this.locations[i].id === faveLocation.id) {
          this.locations[i].has_favorite = true;
          break;
        }
      }
    });
  }
}

export default alt.createStore(LocationStore, 'LocationStore');
