
import alt from '../alt';
import EntityDataActions from '../actions/EntityDataActions';
import DataFetcher from '../utils/DataFetcher';
import EntityFetcher from '../utils/EntityFetcher';

export const EntityDataSource = {
  // "fetch" will become a method on EntityDataStore --> EntityDataStore.fetch({entityId})
  fetch: {
    remote(state, params) {
      return Promise.all([
        DataFetcher.fetch({type: 'entity', typeId: params.entityId}),
        EntityFetcher.fetch({entityId: params.entityId})
      ]).then(([data, entity]) => {
        return {data, entity};
      });
      return ;
    },

    success: EntityDataActions.updateData,
    error: EntityDataActions.fetchDataFailed,
    loading: EntityDataActions.fetchData
  }
};

class EntityDataStore {
  constructor() {
    this.entityData = {};
    this.errorMessage = null;

    this.registerAsync(EntityDataSource);

    this.bindListeners({
      handleUpdateData: EntityDataActions.UPDATE_DATA,
      handleFetchData: EntityDataActions.FETCH_DATA,
      handleFetchDataFailed: EntityDataActions.FETCH_DATA_FAILED
    });
  }

  handleUpdateData(entityData) {
    this.entityData = entityData;
  }

  handleFetchData() {
    //reset to new empty object during fetch
    this.entityData = {};
    this.errorMessage = null;
  }

  handleFetchDataFailed(errorMessage) {
    this.errorMessage = errorMessage;
  }
}

export default alt.createStore(EntityDataStore, 'EntityDataStore');