
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
      const findByEntityId = (fe) => R.find(R.whereEq(R.pluck(['EntityId'], fe)));

      const valuedEntities = allEntities
        .filter((e) => {
          return entityIds.indexOf(e.EntityId) !== -1;
        })
        .map((e) => {
          return R.merge(R.pick(['Value'], findByEntityId(e)(dataRows)))(e);
        });

      return {
        dataRows,
        entities: valuedEntities
      };
    });
  }
};