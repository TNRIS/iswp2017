
import alt from '../alt';
import ThemeMapStateActions from '../actions/ThemeMapStateActions';

class ThemeMapStateStore {
  constructor() {
    this.mapState = {};

    this.bindListeners({
      handleUpdateMapState: ThemeMapStateActions.UPDATE_MAP_STATE,
    });
  }

  handleUpdateMapState({center, zoom}) {
    this.mapState = {center, zoom};
  }
}

export default alt.createStore(ThemeMapStateStore, 'ThemeMapStateStore');