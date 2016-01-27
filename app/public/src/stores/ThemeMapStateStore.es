
import alt from '../alt';
import ThemeMapStateActions from '../actions/ThemeMapStateActions';

class ThemeMapStateStore {
  constructor() {
    this.mapState = {};
    this.isLocked = false;

    this.bindListeners({
      handleLockMap: ThemeMapStateActions.LOCK_MAP,
      handleUnlockMap: ThemeMapStateActions.UNLOCK_MAP
    });
  }

  handleLockMap() {
    this.isLocked = true;
  }

  handleUnlockMap() {
    this.isLocked = false;
  }
}

export default alt.createStore(ThemeMapStateStore, 'ThemeMapStateStore');