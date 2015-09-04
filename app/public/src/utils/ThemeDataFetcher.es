
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

      console.time('process');
      // TODO: FIX: THIS IS CRAZY SLOW!!!! -- R.where appears to be the issue
      // const containedIn = R.flip(R.contains);
      // const valuedEntities = allEntities
      //   .filter(R.where({EntityId: containedIn(entityIds)}))
      //   .map((fe) => R.merge(R.pick(['Value'], findByEntityId(fe)(dataRows)))(fe));

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