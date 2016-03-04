
import R from 'ramda';
import Hoek from 'hoek';

import db from 'db';
import constants from 'lib/constants';

import {handleApiError} from 'lib/utils';
//TODO: Remove "typeTotals" from the population response?

const needsPctDemandsTable = 'vw2017MapEntityNeedsAsPctOfDemand';
const entityTable = 'vw2017MapEntityCoordinates';
const projectsTable = 'vw2017MapWMSProjects';
const projectEntityTable = 'vw2017MapWMSProjectEntityRelationships';

const summaryTables = {
  demands: 'vw2017MapWugDemandsA1',
  needs: 'vw2017MapWugNeedsA1',
  supplies: 'vw2017MapExistingWugSupplyA1',
  population: 'vw2017MapWugPopulationA1',
  strategies: 'vw2017MapWMSWugSupplyA1'
};

const additionalFields = {
  'supplies': [
    'SourceName', 'MapSourceId'
  ],
  'needs': R.map((year) => `NPD${year}`, constants.YEARS),
  'strategies': [
    'WmsName', 'WmsType', 'SourceName', 'SourceType', 'MapSourceId'
  ]
};

function renameValueFields(theme) {
  return constants.YEARS.map((year) => {
    return `${constants.VALUE_PREFIXES[theme]}${year} as Value_${year}`;
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
    `${table}.WugType`, `${table}.WugRegion`, `${table}.WugCounty`,
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
  const query = db.from(table);
  decadeSumFields.forEach((f) => {
    query.modify((queryBuilder) => {
      queryBuilder.sum(f);
    });
  });

  if (whereKey && whereVal) {
    query.modify((queryBuilder) => {
      queryBuilder.where(whereKey, whereVal);
    });
  }

  return query;
}

function selectDataRows(theme, whereKey, whereVal) {
  const table = constants.DATA_TABLES[theme];
  const isNeeds = theme === 'needs';
  const dataSelectFields = makeDataSelectionFields(theme);

  const query = db.select(dataSelectFields).from(table)
      .join(entityTable, `${entityTable}.EntityId`, `${table}.EntityId`);

  if (isNeeds) {
    query.modify((queryBuilder) => {
      queryBuilder.join(needsPctDemandsTable, `${table}.EntityId`, `${needsPctDemandsTable}.EntityId`);
    });
  }

  if (whereKey && whereVal) {
    query.modify((queryBuilder) => {
      queryBuilder.where(`${table}.${whereKey}`, whereVal);
    });
  }

  return query;
}

function selectDecadeSumsGroupedByField(theme, field, whereKey, whereVal) {
  const table = constants.DATA_TABLES[theme];
  const decadeSumFields = makeDecadeSumFields(theme);

  const query = db
    .select(`${field} as ${field}`)
    .from(table)
    .groupBy(field)
    .whereNotNull(field);

  decadeSumFields.forEach((f) => {
    query.modify((queryBuilder) => {
      queryBuilder.sum(f);
    });
  });

  if (whereKey && whereVal) {
    query.modify((queryBuilder) => {
      queryBuilder.where(whereKey, whereVal);
    });
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
          rows: (!data || R.isEmpty(data)) ? [] : data,
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

function selectProjects({whereKey, whereVal}) {
  const selection = db
    .select([
      'b.WMSProjectId', 'b.ProjectName', 'b.ProjectSponsors', 'b.CapitalCost', 'b.OnlineDecade',
      'b.WMSProjectSponsorRegion', 'a.EntityId', 'a.EntityName', 'a.WugType', 'a.WugRegion', 'a.WugCounty'
    ])
    .from(`${projectEntityTable} as a`)
    .join(`${projectsTable} as b`, 'a.WMSProjectId', 'b.WMSProjectId');

  if (whereKey && whereVal) {
    selection.modify((queryBuilder) => {
      queryBuilder.where(whereKey, whereVal);
    });
  }

  return selection.then((results) => {
    return {projects: results};
  });
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

    const region = request.params.regionLetter.toUpperCase();

    const themes = R.keys(constants.DATA_TABLES);
    const dataPromises = themes.map(dataSelectionsByTheme({
      whereKey: 'WugRegion',
      whereVal: region,
      omitRows: !!request.query.omitRows
    }));

    //For Region projects, we select based on WMSProjectSponsorRegion
    const selectProjectsProm = db.select()
      .from(projectsTable)
      .where('WMSProjectSponsorRegion', region)
      .then((results) => {
        return {projects: results};
      });

    dataPromises.push(selectProjectsProm);

    Promise.all(dataPromises)
      .then(R.compose(reply, R.mergeAll))
      .catch(handleApiError(reply));
  }

  getForCounty(request, reply) {
    Hoek.assert(request.params.countyName, 'request.params.countyName is required');

    const themes = R.keys(constants.DATA_TABLES);
    const county = request.params.countyName.toUpperCase();
    const dataPromises = themes.map(dataSelectionsByTheme({
      whereKey: 'WugCounty',
      whereVal: county,
      omitRows: !!request.query.omitRows
    }));

    const selectProjectsProm = selectProjects({
      whereKey: 'WugCounty',
      whereVal: county
    });
    dataPromises.push(selectProjectsProm);

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

    const selectProjectsProm = selectProjects({
      whereKey: 'EntityId',
      whereVal: request.params.entityId
    });
    dataPromises.push(selectProjectsProm);

    Promise.all(dataPromises)
      .then(R.compose(reply, R.mergeAll))
      .catch(handleApiError(reply));
  }

  getForUsageType(request, reply) {
    Hoek.assert(request.params.usageType, 'request.params.usageType is required');

    const themes = R.keys(constants.DATA_TABLES);
    const usageType = request.params.usageType.toUpperCase();
    const dataPromises = themes.map(dataSelectionsByTheme({
      whereKey: 'WugType',
      whereVal: usageType,
      omitRows: !!request.query.omitRows
    }));

    //Not including projects list for UsageType
    // because there are way too many.
    // const selectProjectsProm = selectProjects({
    //   whereKey: 'WugType',
    //   whereVal: usageType
    // });
    // dataPromises.push(selectProjectsProm);

    Promise.all(dataPromises)
      .then(R.compose(reply, R.mergeAll))
      .catch(handleApiError(reply));
  }
}

export default DataController;