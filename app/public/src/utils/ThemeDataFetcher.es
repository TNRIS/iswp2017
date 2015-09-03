
import R from 'ramda';

import EntityFetcher from './EntityFetcher';
import DataRowFetcher from './DataRowFetcher';

export default {
  fetch: ({theme, year, type, typeId}) => {
    return Promise.all([
      DataRowFetcher.fetch({theme, year, type, typeId}),
      EntityFetcher.fetch()
    ]).then(([dataRows, allEntities]) => {
      const entityIds = R.pluck('EntityId', dataRows);
      const containedIn = R.flip(R.contains);
      const filteredEntities = R.filter(
        R.where({EntityId: containedIn(entityIds)})
      )(allEntities);

      return {
        dataRows,
        entities: filteredEntities
      };
    });
  }
};