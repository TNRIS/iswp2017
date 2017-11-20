import alt from '../alt';
import WmsTypeDataActions from '../actions/WmsTypeDataActions';
import DataFetcher from '../utils/DataFetcher';
import WMSFetcher from '../utils/WMSFetcher';

export const WmsDataSource = {
  // "fetch" will become a method on WmsDataStore --> WmsDataStore.fetch({wmsType})
  fetch: {
    remote(state, params) {
      return Promise.all([
        DataFetcher.fetch({type: 'wms', typeId: params.wmsId}),
        WMSFetcher.fetch({WmsId: params.wmsId})
    ]).then(([data, wms]) => {
        return {data, wms};
      });
    },

    success: WmsTypeDataActions.updateData,
    error: WmsTypeDataActions.fetchDataFailed,
    loading: WmsTypeDataActions.fetchData
  }
};

class WmsDataStore {
  constructor() {
    this.wmsData = {};
    this.errorMessage = null;

    this.registerAsync(WmsDataSource);

    this.bindListeners({
      handleUpdateData: WmsTypeDataActions.UPDATE_DATA,
      handleFetchData: WmsTypeDataActions.FETCH_DATA,
      handleFetchDataFailed: WmsTypeDataActions.FETCH_DATA_FAILED
    });
  }

  handleUpdateData(wmsData) {
    this.wmsData = wmsData;
  }

  handleFetchData() {
    //reset to new empty object during fetch
    this.wmsData = {};
    this.errorMessage = null;
  }

  handleFetchDataFailed(errorMessage) {
    this.errorMessage = errorMessage;
  }
}

export default alt.createStore(WmsDataStore, 'WmsDataStore');
