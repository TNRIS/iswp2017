
import alt from '../alt';
import constants from '../constants';
import ThemeMapStateActions from '../actions/ThemeMapStateActions';

class ThemeMapStateStore {
  constructor() {
    this.mapState = {
      center: constants.DEFAULT_MAP_CENTER,
      zoom: constants.DEFAULT_MAP_ZOOM
    };

    this.bindListeners({
      handleUpdateMapState: ThemeMapStateActions.UPDATE_MAP_STATE,
    });
  }

  handleUpdateMapState({center, zoom}) {
    this.mapState = {center, zoom};
  }
}

export default alt.createStore(ThemeMapStateStore, 'ThemeMapStateStore');