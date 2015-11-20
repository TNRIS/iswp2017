
import R from 'ramda';
import Hoek from 'hoek';

import db from 'db';
import constants from 'lib/constants';
import {handleApiError} from 'lib/utils';

const dataTables = {
  demands: 'vw2017MapWugDemand',
  needs: 'vw2017MapWugNeeds',
  supplies: 'vw2017MapExistingWugSupply',
  // strategies: 'vw2017MapWugWms' TODO: Strategy view not yet in DB, ref #51
};

const entityTable = 'vw2017MapEntityCoordinates';

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

//TODO: Refactor. Split out various promises into separate functions then have the main methods
// call the ones they need.
function dataSelectionsByTheme({whereKey, whereVal, includeRows = true} = {}) {
  return (theme) => {
    const dataPromises = [];
    const table = dataTables[theme];

    //TODO: What to do with negative values (as in some strategies)?
    const typeSumFields = makeTypeSumFields(theme);
    let typeSumChain = db.select('WugType');
    typeSumFields.forEach((f) => { typeSumChain = typeSumChain.sum(f); });
    let selectTypeSums = typeSumChain.from(table);
    if (whereKey && whereVal) {
      selectTypeSums = selectTypeSums.where(whereKey, whereVal);
    }
    selectTypeSums = selectTypeSums.groupBy('WugType');
    dataPromises.push(selectTypeSums);

    const decadeSumFields = makeDecadeSumFields(theme);
    let decadeSumChain = db;
    decadeSumFields.forEach((f) => { decadeSumChain = decadeSumChain.sum(f); });
    let selectDecadeSums = decadeSumChain.from(table);
    if (whereKey && whereVal) {
      selectDecadeSums = selectDecadeSums.where(whereKey, whereVal);
    }
    dataPromises.push(selectDecadeSums);

    if (includeRows) {
      const commonFields = [`${table}.EntityId`, `${table}.EntityName`,
        `${table}.WugType`, `${table}.WugRegion`, `${table}.WugCounty`,
        `${entityTable}.Latitude`, `${entityTable}.Longitude`, `${entityTable}.EntityTypeName`,
        `${entityTable}.EntityIsSplit`
      ];

      const dataSelectFields = R.concat(renameValueFields(theme), commonFields);
      let selectData = db.select(dataSelectFields).from(table)
          .join(entityTable, `${entityTable}.EntityId`, `${table}.EntityId`);
      if (whereKey && whereVal) {
        if (whereKey === 'EntityId') {
          //TODO: this is a hack. Fix by splitting out this giant method into smaller pieces.
          selectData = selectData.where(`${table}.EntityId`, whereVal);
        }
        else {
          selectData = selectData.where(whereKey, whereVal);
        }
      }
      dataPromises.push(selectData);
    }

    return Promise.all(dataPromises)
      .then(([typeSums, decadeSums, data]) => {
        const typeTotals = R.zipObj(R.pluck('WugType', typeSums), R.map(R.omit(['WugType']), typeSums));
        const decadeTotals = R.nth(0, decadeSums);

        let rows;
        if (!data || R.isEmpty(data)) {
          rows = [];
        }
        else {
          rows = data;
        }

        return R.assoc(theme, {
          rows,
          typeTotals,
          decadeTotals
        }, {});
      });
  };
}

class DataController {
  getAll(request, reply) {
    const themes = R.keys(dataTables);
    const dataPromises = themes.map(dataSelectionsByTheme());

    Promise.all(dataPromises)
      .then(R.compose(reply, R.mergeAll))
      .catch(handleApiError(reply));
  }

  getForState(request, reply) {
    const themes = R.keys(dataTables);
    const dataPromises = themes.map(dataSelectionsByTheme(
      {includeRows: false}
    ));

    Promise.all(dataPromises)
      .then(R.compose(reply, R.mergeAll))
      .catch(handleApiError(reply));
  }

  getForRegion(request, reply) {
    Hoek.assert(request.params.regionLetter, 'request.params.regionLetter is required');

    const themes = R.keys(dataTables);
    const dataPromises = themes.map(dataSelectionsByTheme(
      {whereKey: 'WugRegion', whereVal: request.params.regionLetter.toUpperCase()}
    ));

    Promise.all(dataPromises)
      .then(R.compose(reply, R.mergeAll))
      .catch(handleApiError(reply));
  }

  getForCounty(request, reply) {
    Hoek.assert(request.params.county, 'request.params.county is required');

    const themes = R.keys(dataTables);
    const dataPromises = themes.map(dataSelectionsByTheme(
      {whereKey: 'WugCounty', whereVal: request.params.county.toUpperCase()}
    ));

    Promise.all(dataPromises)
      .then(R.compose(reply, R.mergeAll))
      .catch(handleApiError(reply));
  }

  getForEntity(request, reply) {
    Hoek.assert(request.params.entityId, 'request.params.entityId is required');

    const themes = R.keys(dataTables);
    const dataPromises = themes.map(dataSelectionsByTheme(
      {whereKey: 'EntityId', whereVal: request.params.entityId}
    ));

    Promise.all(dataPromises)
      .then(R.compose(reply, R.mergeAll))
      .catch(handleApiError(reply));
  }
}

export default DataController;