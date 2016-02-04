
import R from 'ramda';
import Hoek from 'hoek';

import db from 'db';
import constants from 'lib/constants';

import {handleApiError} from 'lib/utils';
//TODO: Remove "typeTotals" from the population response

const needsPctDemandsTable = 'vw2017MapEntityNeedsAsPctOfDemand';

const entityTable = 'vw2017MapEntityCoordinates';

const summaryTables = {
  demands: 'vw2017MapWugDemandsA1',
  needs: 'vw2017MapWugNeedsA1',
  supplies: 'vw2017MapExistingWugSupplyA1',
  population: 'vw2017MapWugPopulationA1',
  strategies: 'vw2017MapWMSWugSupplyA1'
};

const additionalFields = {
  'needs': R.map((year) => `NPD${year}`, constants.YEARS),
  'strategies': [
    'WMSName', 'wmsType as WMSType', 'SourceName', 'SourceType', 'MapSourceId'
  ]
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
  const table = constants.DATA_TABLES[theme];
  const commonFields = [`${table}.EntityId`, `${table}.EntityName`,
    `${table}.WugType as WugType`, `${table}.WugRegion as WugRegion`, `${table}.WugCounty as WugCounty`,
    `${entityTable}.Latitude`, `${entityTable}.Longitude`, `${entityTable}.EntityTypeName`,
    `${entityTable}.EntityIsSplit`
  ];

  let fields = R.concat(renameValueFields(theme), commonFields);
  if (additionalFields[theme]) {
    fields = R.concat(additionalFields[theme], fields);
  }

  return fields;
}

function selectDecadeSums(theme, whereKey, whereVal) {
  const table = constants.DATA_TABLES[theme];
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
  const table = constants.DATA_TABLES[theme];
  const isNeeds = theme === 'needs';
  const dataSelectFields = makeDataSelectionFields(theme);

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

function selectDecadeSumsGroupedByField(theme, field, whereKey, whereVal) {
  const table = constants.DATA_TABLES[theme];
  const decadeSumFields = makeDecadeSumFields(theme);

  let decadeSumChain = db;
  decadeSumFields.forEach((f) => { decadeSumChain = decadeSumChain.sum(f); });
  let query = decadeSumChain
    .select(`${field} as ${field}`)
    .from(table)
    .groupBy(field)
    .whereNotNull(field);

  if (whereKey && whereVal) {
    query = query.where(whereKey, whereVal);
  }

  return query;
}

function zipByField(field, sumGroups) {
  return R.zipObj(R.pluck(field, sumGroups), R.map(R.omit([field]), sumGroups));
}

function dataSelectionsByTheme({whereKey, whereVal, omitRows = false} = {}) {
  return (theme) => {
    const isStrategies = theme === 'strategies';

    //Make an array of all the data selection promises.
    //Note that the order here is important
    // as the following Promise.all fulfillment
    // expects the same order for argument destructuring.
    const dataPromises = [
      selectDecadeSumsGroupedByField(theme, 'WugType', whereKey, whereVal),
      selectDecadeSums(theme, whereKey, whereVal),
      omitRows ? null : selectDataRows(theme, whereKey, whereVal),
      isStrategies ? selectDecadeSumsGroupedByField(
        'strategies', 'SourceType', whereKey, whereVal) : null,
      isStrategies ? selectDecadeSumsGroupedByField(
        'strategies', 'WMSType', whereKey, whereVal) : null
    ];

    return Promise.all(dataPromises)
      .then(([typeSums, decadeSums, data, stratSourceSums, stratTypeSums]) => {
        const decadeTotals = R.nth(0, decadeSums);

        const results = R.assoc(theme, {
          rows : (!data || R.isEmpty(data)) ? [] : data,
          typeTotals: zipByField('WugType', typeSums),
          decadeTotals
        }, {});

        if (isStrategies) {
          results.strategies.strategySourceTotals = zipByField('SourceType', stratSourceSums);
          results.strategies.strategyTypeTotals = zipByField('WMSType', stratTypeSums);
        }

        return results;
      });
  };
}

class DataController {
  getForState(request, reply) {
    const themes = R.keys(constants.DATA_TABLES);
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

    const themes = R.keys(constants.DATA_TABLES);
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

    const themes = R.keys(constants.DATA_TABLES);
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

    const themes = R.keys(constants.DATA_TABLES);
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

    const themes = R.keys(constants.DATA_TABLES);
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