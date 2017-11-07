import alt from '../alt';
import WmsTypeDataActions from '../actions/WmsTypeDataActions';
import DataFetcher from '../utils/DataFetcher';

export const WmsTypeDataSource = {
  fetch: {
    remote(state, params) {
      return Promise.all([
        DataFetcher.fetch({type: 'wmstype', typeId: params.wmsType})
    ]).then(([data]) => {
        return {data};
      });
    },

    success: WmsTypeDataActions.updateData,
    error: WmsTypeDataActions.fetchDataFailed,
    loading: WmsTypeDataActions.fetchData
  }
};

class WmsTypeDataStore {
  constructor() {
    this.wmsTypeData = {};
    this.errorMessage = null;

    this.registerAsync(WmsTypeDataSource);

    this.bindListeners({
      handleUpdateData: WmsTypeDataActions.UPDATE_DATA,
      handleFetchData: WmsTypeDataActions.FETCH_DATA,
      handleFetchDataFailed: WmsTypeDataActions.FETCH_DATA_FAILED
    });
  }

  handleUpdateData(wmsTypeData) {
    this.wmsTypeData = wmsTypeData;
  }

  handleFetchData() {
    //reset to new empty object during fetch
    this.wmsTypeData = {};
    this.errorMessage = null;
  }

  handleFetchDataFailed(errorMessage) {
    this.errorMessage = errorMessage;
  }
}

export default alt.createStore(WmsTypeDataStore, 'WmsTypeDataStore');
