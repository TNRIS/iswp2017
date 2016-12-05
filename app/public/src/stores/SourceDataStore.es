
import alt from '../alt';
import SourceDataActions from '../actions/SourceDataActions';
import DataFetcher from '../utils/DataFetcher';
import BoundaryFetcher from '../utils/BoundaryFetcher';

export const SourceDataSource = {
  // "fetch" will become a method on SourceDataStore --> SourceDataStore.fetch({sourceId})
  fetch: {
    remote(state, params) {
      return Promise.all([
        DataFetcher.fetch({type: 'source', typeId: params.sourceId}),
        BoundaryFetcher.fetch({type: 'source', typeId: params.sourceId})
      ]).then(([data, boundary]) => {
        return {data, boundary};
      });
    },

    success: SourceDataActions.updateSourceData,
    error: SourceDataActions.fetchSourceDataFailed,
    loading: SourceDataActions.fetchSourceData
  }
};

class SourceDataStore {
  constructor() {
    this.sourceData = {};
    this.errorMessage = null;

    this.registerAsync(SourceDataSource);

    this.bindListeners({
      handleUpdateData: SourceDataActions.UPDATE_SOURCE_DATA,
      handleFetchData: SourceDataActions.FETCH_SOURCE_DATA,
      handleFetchDataFailed: SourceDataActions.FETCH_SOURCE_DATA_FAILED
    });
  }

  handleUpdateData(sourceData) {
    this.sourceData = sourceData;
  }

  handleFetchData() {
    //reset to new empty object during fetch
    this.sourceData = {};
    this.errorMessage = null;
  }

  handleFetchDataFailed(errorMessage) {
    this.errorMessage = errorMessage;
  }
}

export default alt.createStore(SourceDataStore, 'SourceDataStore');