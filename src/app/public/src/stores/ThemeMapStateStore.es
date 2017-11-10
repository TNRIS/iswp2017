
import alt from '../alt';
import ThemeMapStateActions from '../actions/ThemeMapStateActions';

class ThemeMapStateStore {
  constructor() {
    this.isLocked = false;
    this.showProjects = "Hide";

    this.bindListeners({
      handleLockMap: ThemeMapStateActions.LOCK_MAP,
      handleUnlockMap: ThemeMapStateActions.UNLOCK_MAP,
      handleShowProjects:ThemeMapStateActions.SHOW_PRJ,
      handleHideProjects: ThemeMapStateActions.HIDE_PRJ
    });
  }

  handleLockMap() {
    this.isLocked = true;
  }

  handleUnlockMap() {
    this.isLocked = false;
  }

  handleShowProjects () {
    this.showProjects = "Show";
  }

  handleHideProjects () {
    this.showProjects = "Hide";
  }
}

export default alt.createStore(ThemeMapStateStore, 'ThemeMapStateStore');