import alt from '../alt';

class NavStateActions {
  updateNavState(navState) {
    this.dispatch(navState);
  }
}

export default alt.createActions(NavStateActions);