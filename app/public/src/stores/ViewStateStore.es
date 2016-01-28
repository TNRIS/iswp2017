
import alt from '../alt';
import ViewStateActions from '../actions/ViewStateActions';

class ViewStateStore {
  constructor() {
    this.viewState = null;

    this.bindListeners({
      handleUpdateViewState: ViewStateActions.UPDATE_VIEW_STATE
    });
  }

  handleUpdateViewState(pathname) {
    // parse pathname and make a viewState
    // object like {view: 'county', id: 'travis'}
    let path = pathname.toLowerCase();

    //remove preceding slash if it has one
    if (path[0] === '/') {
      path = path.substring(1);
    }
    //remove trailing slash if it has one
    if (path[path.length - 1] === '/') {
      path = path.substring(0, path.length - 1);
    }

    const parts = path.split('/');

    this.viewState = {
      view: parts[0],
      id: parts[1] || null
    };
  }
}

export default alt.createStore(ViewStateStore, 'ViewStateStore');