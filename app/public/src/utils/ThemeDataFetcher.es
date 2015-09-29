
import BoundaryFetcher from './BoundaryFetcher';
import DataRowFetcher from './DataRowFetcher';

export default {
  fetch: ({theme, year, type, typeId}) => {
    return Promise.all([
      DataRowFetcher.fetch({theme, year, type, typeId}),
      BoundaryFetcher.fetch({type, typeId})
    ]).then(([dataRows, boundary]) => {
      return {
        dataRows,
        boundary
      };
    });
  }
};