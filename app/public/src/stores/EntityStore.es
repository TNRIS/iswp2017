
import alt from '../alt';
import EntityActions from '../actions/EntityActions';

class EntityStore {
  constructor() {
    this.entities = [];
    this.errorMessage = null;

    this.bindListeners({
      handleUpdateEntities: EntityActions.UPDATE_ENTITIES,
      handleFetchEntities: EntityActions.FETCH_ENTITIES,
      handleFetchEntitiesFailed: EntityActions.FETCH_ENTITIES_FAILED
    });
  }

  handleUpdateEntities(entities) {
    this.entities = entities;
  }

  handleFetchEntities() {
    this.entities = [];
    this.errorMessage = null;
  }

  handleFetchEntitiesFailed(errorMessage) {
    this.errorMessage = errorMessage;
  }
}

export default alt.createStore(EntityStore, 'EntityStore');