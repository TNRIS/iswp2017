import alt from '../alt';

import EntityFetcher from '../utils/EntityFetcher';

class EntityActions {
  updateEntities(entities) {
    this.dispatch(entities);
  }

  fetchEntities(options) {
    this.dispatch();
    EntityFetcher.fetch(options)
      .then((entities) => {
        this.actions.updateEntities(entities);
      })
      .catch((error) => {
        this.actions.fetchEntitiesFailed(error);
      });
  }

  fetchEntitiesFailed(error) {
    // TODO: Better error message generation
    this.dispatch(error.toString());
  }
}

export default alt.createActions(EntityActions);