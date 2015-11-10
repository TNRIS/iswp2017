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

const summaryDataTables = {
  // demands: 'vwMapWugDemandsA1',
  // needs: 'vwMapWugNeedsA1',
  // supplies: 'vwMapWugExistingSupplyA1',
  strategies: 'vwMapWugWmsA1'
};

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
    let selectData = db.select(dataSelectFields).from(table)
        .join(entityTable, `${entityTable}.EntityId`, `${table}.EntityId`);
    if (whereKey && whereVal) {
      selectData = selectData.where(whereKey, whereVal);
    }

    //TODO: What to do with negative values (as in some strategies)?
    const typeSumFields = makeTypeSumFields(theme);
    let typeSumChain = db.select('WugType');
    typeSumFields.forEach((f) => { typeSumChain = typeSumChain.sum(f); });
    let selectTypeSums = typeSumChain.from(table);
    if (whereKey && whereVal) {
      selectTypeSums = selectTypeSums.where(whereKey, whereVal);
    }
    selectTypeSums = selectTypeSums.groupBy('WugType');

    const decadeSumFields = makeDecadeSumFields(theme);
    let decadeSumChain = db;
    decadeSumFields.forEach((f) => { decadeSumChain = decadeSumChain.sum(f); });
    let selectDecadeSums = decadeSumChain.from(table);
    if (whereKey && whereVal) {
      selectDecadeSums = selectDecadeSums.where(whereKey, whereVal);
    }

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
  getAll(request, reply) {
    const themes = R.keys(dataTables);
    const dataPromises = themes.map(dataSelectionsByTheme());

    Promise.all(dataPromises)
      .then(R.compose(reply, R.mergeAll));
  }

  getSummaries(request, reply) {
    const themes = R.keys(summaryDataTables);
    const promises = themes.map((theme) => {
      const table = summaryDataTables[theme];
      return db.select('*').from(table).groupBy('DECADE').then((data) => {
        return R.assoc(theme, {rows: data}, {});
      });
    });

    Promise.all(promises)
      .then(R.compose(reply, R.mergeAll));
  }

  getForRegion(request, reply) {
    Hoek.assert(request.params.regionLetter, 'request.params.regionLetter is required');

    const themes = R.keys(dataTables);
    const dataPromises = themes.map(dataSelectionsByTheme(
      'WugRegion', request.params.regionLetter.toUpperCase())
    );

    Promise.all(dataPromises)
      .then(R.compose(reply, R.mergeAll));
  }

  getForCounty(request, reply) {
    Hoek.assert(request.params.county, 'request.params.county is required');

    const themes = R.keys(dataTables);
    const dataPromises = themes.map(dataSelectionsByTheme(
      'WugCounty', request.params.county.toUpperCase())
    );

    Promise.all(dataPromises)
      .then(R.compose(reply, R.mergeAll));
  }

  getForEntity(request, reply) {
    Hoek.assert(request.params.entityId, 'request.params.entityId is required');

    const themes = R.keys(dataTables);
    const dataPromises = themes.map(dataSelectionsByTheme(
      'entityID', request.params.entityId)
    );

    Promise.all(dataPromises)
      .then(R.compose(reply, R.mergeAll));
  }
}

export default DataController;