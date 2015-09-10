
import R from 'ramda';

import EntityFetcher from './EntityFetcher';
import BoundaryFetcher from './BoundaryFetcher';
import DataRowFetcher from './DataRowFetcher';

export default {
  fetch: ({theme, year, type, typeId}) => {
    return Promise.all([
      DataRowFetcher.fetch({theme, year, type, typeId}),
      EntityFetcher.fetch(),
      BoundaryFetcher.fetch({type, typeId})
    ]).then(([dataRows, allEntities, boundary]) => {
      const entityIds = R.pluck('EntityId', dataRows);
      const sumValues = R.compose(R.sum, R.pluck('Value'));
      const hasSameId = R.compose(R.propEq('EntityId'), R.prop('EntityId'));

      const valuedEntities = allEntities
        .filter((e) => {
          return entityIds.indexOf(e.EntityId) !== -1;
        })
        .map((e) => {
          const totalValue = sumValues(dataRows.filter(hasSameId(e)));
          return R.assoc('Value', totalValue, e);
        });

      return {
        dataRows,
        entities: valuedEntities,
        boundary
      };
    });
  }
};