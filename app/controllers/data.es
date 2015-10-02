import R from 'ramda';
import Hoek from 'hoek';

import db from 'db';
import constants from 'lib/constants';

const dataTables = {
  demands: 'vwMapWugDemand',
  needs: 'vwMapWugNeeds',
  supplies: 'vwMapExistingWugSupply',
  strategies: 'vwMapWugWms'
};

const themes = R.keys(dataTables);

const commonFields = ['entityId as EntityId', 'EntityName', 'WugType', 'WugRegion', 'WugCounty'];

const renameValueField = (theme, year, newName = 'Value') => {
  return `${constants.VALUE_PREFIXES[theme]}${year} as ${newName}`;
};

function dataSelectionsByTheme(year, whereKey, whereVal) {
  return (theme) => {
    const table = dataTables[theme];
    const columns = R.append(renameValueField(theme, year), commonFields);

    const selectData = db.select(columns).from(table)
        .where(whereKey, whereVal); //'WugRegion', request.params.regionLetter.toUpperCase());

    //TODO: What to do with negative values (as in some strategies)?
    const selectSums = db.select('WugType')
      .sum(renameValueField(theme, year, 'Total'))
      .from(table)
      .where(whereKey, whereVal) //'WugRegion', request.params.regionLetter.toUpperCase())
      .groupBy('WugType');

    return Promise.all([selectData, selectSums])
      .then(([data, totals]) => {
        const totalsByType = R.zipObj(R.pluck('WugType', totals), R.pluck('Total', totals));
        return R.assoc(theme, {data: data, totals: totalsByType}, {});
      });
  };
}

class DataController {
  getForRegion(request, reply) {
    Hoek.assert(request.params.year, 'request.params.year is required');
    Hoek.assert(request.params.regionLetter, 'request.params.regionLetter is required');

    const dataPromises = themes.map(dataSelectionsByTheme(
      request.params.year, 'WugRegion', request.params.regionLetter.toUpperCase())
    );

    Promise.all(dataPromises)
      .then(R.compose(reply, R.mergeAll));
  }

  getForCounty(request, reply) {
    Hoek.assert(request.params.year, 'request.params.year is required');
    Hoek.assert(request.params.county, 'request.params.county is required');

    const dataPromises = themes.map(dataSelectionsByTheme(
      request.params.year, 'WugCounty', request.params.county.toUpperCase())
    );

    Promise.all(dataPromises)
      .then(R.compose(reply, R.mergeAll));
  }

  getForEntity(request, reply) {
    Hoek.assert(request.params.year, 'request.params.year is required');
    Hoek.assert(request.params.entityId, 'request.params.entityId is required');

    const dataPromises = themes.map(dataSelectionsByTheme(
      request.params.year, 'entityID', request.params.entityId)
    );

    Promise.all(dataPromises)
      .then(R.compose(reply, R.mergeAll));
  }
}

export default DataController;