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

const entityTable = 'vwMapEntityCoordinates';

const renameValueFields = (theme) => {
  return constants.YEARS.map((year) => {
    return `${constants.VALUE_PREFIXES[theme]}${year} as Value_${year}`;
  });
};

const makeTypeSumFields = (theme) => {
  return constants.YEARS.map((year) => {
    return `${constants.VALUE_PREFIXES[theme]}${year} as Total_${year}`;
  });
};

const makeDecadeSumFields = (theme) => {
  return constants.YEARS.map((year) => {
    return `${constants.VALUE_PREFIXES[theme]}${year} as ${year}`;
  });
};

function dataSelectionsByTheme(whereKey, whereVal) {
  return (theme) => {
    const table = dataTables[theme];
    const commonFields = [`${table}.EntityId as EntityId`, `${table}.EntityName`,
      `${table}.WugType`, `${table}.WugRegion`, `${table}.WugCounty`,
      `${entityTable}.Latitude`, `${entityTable}.Longitude`, `${entityTable}.entityType as EntityType`
    ];

    const dataSelectFields = R.concat(renameValueFields(theme), commonFields);
    const selectData = db.select(dataSelectFields).from(table)
        .join(entityTable, `${entityTable}.EntityId`, `${table}.EntityId`)
        .where(whereKey, whereVal);

    //TODO: What to do with negative values (as in some strategies)?
    const typeSumFields = makeTypeSumFields(theme);
    let typeSumChain = db.select('WugType');
    typeSumFields.forEach((f) => { typeSumChain = typeSumChain.sum(f); });
    const selectTypeSums = typeSumChain.from(table)
      .where(whereKey, whereVal)
      .groupBy('WugType');

    const decadeSumFields = makeDecadeSumFields(theme);
    let decadeSumChain = db;
    decadeSumFields.forEach((f) => { decadeSumChain = decadeSumChain.sum(f); });
    const selectDecadeSums = decadeSumChain.from(table)
      .where(whereKey, whereVal);

    return Promise.all([selectData, selectTypeSums, selectDecadeSums])
      .then(([data, typeSums, decadeSums]) => {
        if (!data || R.isEmpty(data)) {
          //return empty properties
          return R.assoc(theme, {
            rows: [],
            typeTotals: {},
            decadeTotals: {}
          }, {});
        }

        const totalsByType = R.zipObj(R.pluck('WugType', typeSums), R.map(R.omit(['WugType']), typeSums));
        const totalsByDecade = R.nth(0, decadeSums);
        return R.assoc(theme, {
          rows: data,
          typeTotals: totalsByType,
          decadeTotals: totalsByDecade
        }, {});
      });
  };
}

class DataController {
  getForRegion(request, reply) {
    Hoek.assert(request.params.regionLetter, 'request.params.regionLetter is required');

    const dataPromises = themes.map(dataSelectionsByTheme(
      'WugRegion', request.params.regionLetter.toUpperCase())
    );

    Promise.all(dataPromises)
      .then(R.compose(reply, R.mergeAll));
  }

  getForCounty(request, reply) {
    Hoek.assert(request.params.county, 'request.params.county is required');

    const dataPromises = themes.map(dataSelectionsByTheme(
      'WugCounty', request.params.county.toUpperCase())
    );

    Promise.all(dataPromises)
      .then(R.compose(reply, R.mergeAll));
  }

  getForEntity(request, reply) {
    Hoek.assert(request.params.entityId, 'request.params.entityId is required');

    const dataPromises = themes.map(dataSelectionsByTheme(
      'entityID', request.params.entityId)
    );

    Promise.all(dataPromises)
      .then(R.compose(reply, R.mergeAll));
  }
}

export default DataController;