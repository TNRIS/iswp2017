import alt from '../alt';

class MapStateActions {
  updateMapState(mapState) {
    this.dispatch(mapState);
  }
}

export default alt.createActions(MapStateActions);