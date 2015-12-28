
import R from 'ramda';
import Hoek from 'hoek';

import db from 'db';
import constants from 'lib/constants';
import {handleApiError} from 'lib/utils';

const dataTables = {
  demands: 'vw2017MapWugDemand',
  needs: 'vw2017MapWugNeeds',
  supplies: 'vw2017MapExistingWugSupply',
  population: 'vw2017MapWugPopulation' //TODO: Remove "typeTotals" from the population response
  // strategies: 'vw2017MapWugWms' TODO: Strategy view not yet in DB, ref #51
};

const needsPctDemandsTable = 'vw2017MapEntityNeedsAsPctOfDemand';

const entityTable = 'vw2017MapEntityCoordinates';

const summaryTables = {
  demands: 'vw2017MapWugDemandsA1',
  needs: 'vw2017MapWugNeedsA1',
  supplies: 'vw2017MapExistingWugSupplyA1',
  population: 'vw2017MapWugPopulationA1'
  // strategies: 'vw2017MapWugWms' TODO: Strategy view not yet in DB, ref #51
};

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
function dataSelectionsByTheme({whereKey, whereVal, omitRows = false} = {}) {
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

    if (!omitRows) {
      const commonFields = [`${table}.EntityId`, `${table}.EntityName`,
        `${table}.WugType`, `${table}.WugRegion`, `${table}.WugCounty`,
        `${entityTable}.Latitude`, `${entityTable}.Longitude`, `${entityTable}.EntityTypeName`,
        `${entityTable}.EntityIsSplit`
      ];

      let dataSelectFields = R.concat(renameValueFields(theme), commonFields);

      if (theme === 'needs') {
        const npdCols = R.map((year) => `NPD${year}`, constants.YEARS);
        dataSelectFields = R.concat(npdCols, dataSelectFields);
      }

      let selectData = db.select(dataSelectFields).from(table)
          .join(entityTable, `${entityTable}.EntityId`, `${table}.EntityId`);

      if (theme === 'needs') {
        selectData = selectData.join(needsPctDemandsTable, `${table}.EntityId`, `${needsPctDemandsTable}.EntityId`);
      }

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
    const dataPromises = themes.map(dataSelectionsByTheme(
      {omitRows: !!request.query.omitRows}
    ));

    Promise.all(dataPromises)
      .then(R.compose(reply, R.mergeAll))
      .catch(handleApiError(reply));
  }

  getForState(request, reply) {
    const themes = R.keys(dataTables);
    const dataPromises = themes.map(dataSelectionsByTheme(
      {omitRows: !!request.query.omitRows}
    ));

    Promise.all(dataPromises)
      .then(R.compose(reply, R.mergeAll))
      .catch(handleApiError(reply));
  }

  getStateSummary(request, reply) {
    const themes = R.keys(summaryTables);
    const dataPromises = themes.map((theme) => {
      const table = summaryTables[theme];
      const prom = db.select('*').from(table).groupBy('DECADE');
      return prom.then((rows) => {
        //Group by DECADE to turn the DECADE into keys of return object
        //Select the 0th element of the grouped array (which will only have one member)
        // to get rid of extranneous array
        const groupedByDecade = R.map(R.nth(0), R.groupBy(R.prop('DECADE'), rows));
        return R.assoc(theme, groupedByDecade, {});
      });
    });

    Promise.all(dataPromises)
      .then(R.compose(reply, R.mergeAll))
      .catch(handleApiError(reply));
  }

  getForRegion(request, reply) {
    Hoek.assert(request.params.regionLetter, 'request.params.regionLetter is required');

    const themes = R.keys(dataTables);
    const dataPromises = themes.map(dataSelectionsByTheme({
      whereKey: 'WugRegion',
      whereVal: request.params.regionLetter.toUpperCase(),
      omitRows: !!request.query.omitRows
    }));

    Promise.all(dataPromises)
      .then(R.compose(reply, R.mergeAll))
      .catch(handleApiError(reply));
  }

  getForCounty(request, reply) {
    Hoek.assert(request.params.county, 'request.params.county is required');

    const themes = R.keys(dataTables);
    const dataPromises = themes.map(dataSelectionsByTheme({
      whereKey: 'WugCounty',
      whereVal: request.params.county.toUpperCase(),
      omitRows: !!request.query.omitRows
    }));

    Promise.all(dataPromises)
      .then(R.compose(reply, R.mergeAll))
      .catch(handleApiError(reply));
  }

  getForEntity(request, reply) {
    Hoek.assert(request.params.entityId, 'request.params.entityId is required');

    const themes = R.keys(dataTables);
    const dataPromises = themes.map(dataSelectionsByTheme({
      whereKey: 'EntityId',
      whereVal: request.params.entityId,
      omitRows: !!request.query.omitRows
    }));

    Promise.all(dataPromises)
      .then(R.compose(reply, R.mergeAll))
      .catch(handleApiError(reply));
  }
}

export default DataController;