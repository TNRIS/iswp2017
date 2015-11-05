
import alt from '../alt';
import NavStateActions from '../actions/NavStateActions';

class NavStateStore {
  constructor() {
    this.selectedSubNav = 'default';

    this.bindListeners({
      handleUpdateNavState: NavStateActions.UPDATE_NAV_STATE
    });
  }

  handleUpdateNavState(selectedSubNav) {
    this.selectedSubNav = selectedSubNav;
  }
}

export default alt.createStore(NavStateStore, 'NavStateStore');