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

const commonFields = ['entityId as EntityId', 'EntityName', 'WugType', 'WugRegion', 'WugCounty'];
const renameValueField = (theme, year) => {
  return `${constants.VALUE_PREFIXES[theme]}${year} as Value`;
};

class DataController {
  getForRegion(request, reply) {
    Hoek.assert(request.params.year, 'request.params.year is required');
    Hoek.assert(request.params.regionLetter, 'request.params.regionLetter is required');

    const dataPromises = R.keys(dataTables).map((theme) => {
      const table = dataTables[theme];

      const selectFields = R.append(renameValueField(theme, request.params.year), commonFields);

      return db.select(selectFields).from(table)
        .where('WugRegion', request.params.regionLetter.toUpperCase());
    });

    Promise.all(dataPromises)
      .then(R.compose(reply, R.zipObj(R.keys(dataTables))));
  }

  getForCounty(request, reply) {
    Hoek.assert(request.params.year, 'request.params.year is required');
    Hoek.assert(request.params.county, 'request.params.county is required');

    const dataPromises = R.keys(dataTables).map((theme) => {
      const table = dataTables[theme];

      const selectFields = R.append(renameValueField(theme, request.params.year), commonFields);

      return db.select(selectFields).from(table)
        .where('WugCounty', request.params.county.toUpperCase());
    });

    Promise.all(dataPromises)
      .then(R.compose(reply, R.zipObj(R.keys(dataTables))));
  }

  getForEntity(request, reply) {
    Hoek.assert(request.params.year, 'request.params.year is required');
    Hoek.assert(request.params.entityId, 'request.params.entityId is required');

    const dataPromises = R.keys(dataTables).map((theme) => {
      const table = dataTables[theme];

      const selectFields = R.append(renameValueField(theme, request.params.year), commonFields);

      return db.select(selectFields).from(table)
        .where('entityID', request.params.entityId);
    });

    Promise.all(dataPromises)
      .then(R.compose(reply, R.zipObj(R.keys(dataTables))));
  }
}

export default DataController;