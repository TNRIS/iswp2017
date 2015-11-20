
import alt from '../alt';
import CdbUtil from '../utils/CdbUtil';
import CountyNamesActions from '../actions/CountyNamesActions';

export const CountyNamesSource = {
  // "fetch" will become a method on CountyNamesStore --> CountyNamesStore.fetch({type, typeId})
  fetch: {
    remote() {
      return CdbUtil.getCountyNames();
    },

    local(state) {
      return state.countyNames;
    },

    success: CountyNamesActions.updateNames,
    error: CountyNamesActions.fetchNamesFailed,
    loading: CountyNamesActions.fetchNames
  }
};

class CountyNamesStore {
  constructor() {
    this.countyNames = null;
    this.errorMessage = null;

    this.registerAsync(CountyNamesSource);

    this.bindListeners({
      handleUpdate: CountyNamesActions.UPDATE_NAMES,
      handleFetch: CountyNamesActions.FETCH_NAMES,
      handleFetchFailed: CountyNamesActions.FETCH_NAMES_FAILED
    });
  }

  handleUpdate(countyNames) {
    this.countyNames = countyNames;
  }

  handleFetch() {
    //reset during fetch
    this.countyNames = null;
    this.errorMessage = null;
  }

  handleFetchFailed(errorMessage) {
    this.errorMessage = errorMessage;
  }
}

export default alt.createStore(CountyNamesStore, 'CountyNamesStore');