
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

function renameValueFields(theme) {
  return constants.YEARS.map((year) => {
    return `${constants.VALUE_PREFIXES[theme]}${year} as Value_${year}`;
  });
}

function makeTypeSumFields(theme) {
  return constants.YEARS.map((year) => {
    return `${constants.VALUE_PREFIXES[theme]}${year} as Total_${year}`;
  });
}

function makeDecadeSumFields(theme) {
  return constants.YEARS.map((year) => {
    return `${constants.VALUE_PREFIXES[theme]}${year} as ${year}`;
  });
}

function makeDataSelectionFields(theme) {
  const table = dataTables[theme];
  const commonFields = [`${table}.EntityId`, `${table}.EntityName`,
    `${table}.WugType`, `${table}.WugRegion`, `${table}.WugCounty`,
    `${entityTable}.Latitude`, `${entityTable}.Longitude`, `${entityTable}.EntityTypeName`,
    `${entityTable}.EntityIsSplit`
  ];

  return R.concat(renameValueFields(theme), commonFields);
}

function selectTypeSums(theme, whereKey, whereVal) {
  const table = dataTables[theme];
  const typeSumFields = makeTypeSumFields(theme);

  let typeSumChain = db.select('WugType');
  typeSumFields.forEach((f) => { typeSumChain = typeSumChain.sum(f); });
  let query = typeSumChain.from(table);
  if (whereKey && whereVal) {
    query = query.where(whereKey, whereVal);
  }
  query = query.groupBy('WugType');
  return query;
}

function selectDecadeSums(theme, whereKey, whereVal) {
  const table = dataTables[theme];
  const decadeSumFields = makeDecadeSumFields(theme);
  let decadeSumChain = db;
  decadeSumFields.forEach((f) => { decadeSumChain = decadeSumChain.sum(f); });
  let query = decadeSumChain.from(table);
  if (whereKey && whereVal) {
    query = query.where(whereKey, whereVal);
  }
  return query;
}

function selectDataRows(theme, whereKey, whereVal) {
  const table = dataTables[theme];
  const isNeeds = theme === 'needs';

  let dataSelectFields = makeDataSelectionFields(theme);

  if (isNeeds) {
    const npdCols = R.map((year) => `NPD${year}`, constants.YEARS);
    dataSelectFields = R.concat(npdCols, dataSelectFields);
  }

  let query = db.select(dataSelectFields).from(table)
      .join(entityTable, `${entityTable}.EntityId`, `${table}.EntityId`);

  if (isNeeds) {
    query = query.join(needsPctDemandsTable, `${table}.EntityId`, `${needsPctDemandsTable}.EntityId`);
  }

  if (whereKey && whereVal) {
    query = query.where(`${table}.${whereKey}`, whereVal);
  }

  return query;
}


function dataSelectionsByTheme({whereKey, whereVal, omitRows = false} = {}) {
  return (theme) => {
    const dataPromises = [];

    //TODO: What to do with negative values (as in some strategies)?
    dataPromises.push(selectTypeSums(theme, whereKey, whereVal));
    dataPromises.push(selectDecadeSums(theme, whereKey, whereVal));

    if (!omitRows) {
      dataPromises.push(selectDataRows(theme, whereKey, whereVal));
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
  getForState(request, reply) {
    const themes = R.keys(dataTables);
    const dataPromises = themes.map(dataSelectionsByTheme(
      {omitRows: !!request.query.omitRows}
    ));

    Promise.all(dataPromises)
      .then(R.compose(reply, R.mergeAll))
      .catch(handleApiError(reply));
  }

  getRegionalSummaries(request, reply) {
    const themes = R.keys(summaryTables);
    const dataPromises = themes.map((theme) => {
      const table = summaryTables[theme];
      const prom = db.select('*').from(table);
      return prom.then((rows) => {
        //Group by DECADE to turn the DECADE into keys of return object
        const groupedByDecade = R.groupBy(R.prop('DECADE'), rows);
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
    Hoek.assert(request.params.countyName, 'request.params.countyName is required');

    const themes = R.keys(dataTables);
    const dataPromises = themes.map(dataSelectionsByTheme({
      whereKey: 'WugCounty',
      whereVal: request.params.countyName.toUpperCase(),
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

  getForUsageType(request, reply) {
    Hoek.assert(request.params.usageType, 'request.params.usageType is required');

    const themes = R.keys(dataTables);
    const dataPromises = themes.map(dataSelectionsByTheme({
      whereKey: 'WugType',
      whereVal: request.params.usageType.toUpperCase(),
      omitRows: !!request.query.omitRows
    }));

    Promise.all(dataPromises)
      .then(R.compose(reply, R.mergeAll))
      .catch(handleApiError(reply));
  }
}

export default DataController;