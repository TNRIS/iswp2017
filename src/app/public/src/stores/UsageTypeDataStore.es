
import R from 'ramda';

import alt from '../alt';
import UsageTypeDataActions from '../actions/UsageTypeDataActions';
import DataFetcher from '../utils/DataFetcher';

export const UsageTypeDataSource = {
  // "fetch" will become a method on UsageTypeDataStore --> UsageTypeDataStore.fetch({typeId})
  fetch: {
    remote(state, params) {
      return DataFetcher.fetch({type: 'usagetype', typeId: params.typeId});
    },

    success: UsageTypeDataActions.updateData,
    error: UsageTypeDataActions.fetchDataFailed,
    loading: UsageTypeDataActions.fetchData
  }
};

class UsageTypeDataStore {
  constructor() {
    this.data = {};
    this.errorMessage = null;

    this.registerAsync(UsageTypeDataSource);

    this.bindListeners({
      handleUpdateData: UsageTypeDataActions.UPDATE_DATA,
      handleFetchData: UsageTypeDataActions.FETCH_DATA,
      handleFetchDataFailed: UsageTypeDataActions.FETCH_DATA_FAILED
    });
  }

  handleUpdateData(data) {
    this.data = data;
  }

  handleFetchData() {
    //reset to new empty object during fetch
    this.data = {};
    this.errorMessage = null;
  }

  handleFetchDataFailed(errorMessage) {
    this.errorMessage = errorMessage;
  }
}

export default alt.createStore(UsageTypeDataStore, 'UsageTypeDataStore');