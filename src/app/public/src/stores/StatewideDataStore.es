
import R from 'ramda';

import alt from '../alt';
import StatewideDataActions from '../actions/StatewideDataActions';
import DataFetcher from '../utils/DataFetcher';
import RegionalSummaryFetcher from '../utils/RegionalSummaryFetcher';

export const StatewideDataSource = {
  // "fetch" will become a method on StatewideDataStore --> StatewideDataStore.fetch({type, typeId})
  fetch: {
    remote() {
      return Promise.all([
        DataFetcher.fetch({type: 'statewide'}),
        RegionalSummaryFetcher.fetch()
      ]).then(([data, summary]) => {
        R.keys(data).forEach((theme) => {
          data[theme].regionalSummary = summary[theme];
        });
        return data;
      });
    },

    success: StatewideDataActions.updateData,
    error: StatewideDataActions.fetchDataFailed,
    loading: StatewideDataActions.fetchData
  }
};

class StatewideDataStore {
  constructor() {
    this.data = {};
    this.errorMessage = null;

    this.registerAsync(StatewideDataSource);

    this.bindListeners({
      handleUpdateData: StatewideDataActions.UPDATE_DATA,
      handleFetchData: StatewideDataActions.FETCH_DATA,
      handleFetchDataFailed: StatewideDataActions.FETCH_DATA_FAILED
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

export default alt.createStore(StatewideDataStore, 'StatewideDataStore');