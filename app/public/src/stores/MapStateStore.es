
import alt from '../alt';
import MapStateActions from '../actions/MapStateActions';

class MapStateStore {
  constructor() {
    this.center = null;
    this.zoom = null;
    this.bindListeners({
      handleUpdateMapState: MapStateActions.UPDATE_MAP_STATE
    });
  }

  handleUpdateMapState({center, zoom}) {
    this.center = center;
    this.zoom = zoom;
  }
}

export default alt.createStore(MapStateStore, 'MapStateStore');