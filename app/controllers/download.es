
import Hoek from 'hoek';
import Papa from 'papaparse';

import db from 'db';
import constants from 'lib/constants';
import {handleApiError} from 'lib/utils';

const entityTable = 'vw2017MapEntityCoordinates';

function toCsvReply(reply, filename = 'data.csv') {
  return (data) => {
    const csvData = Papa.unparse(data);
    return reply(csvData)
      .type('text/csv')
      .header('content-disposition', `attachment; filename=${filename}`);
  };
}

function selectData(theme, whereKey, whereVal) {
  const table = constants.DATA_TABLES[theme];
  let selection = db.select().from(table);

  if (whereKey && whereVal) {
    selection = selection.where(whereKey, whereVal);
  }

  selection = selection.orderBy('EntityId');
  return selection;
}

class DownloadController {
  getEntitiesCsv(request, reply) {
    db.select().from(entityTable).orderBy('EntityId')
      .then(toCsvReply(reply, 'entities.csv'))
      .catch(handleApiError(reply));
  }

  getThemeCsv(request, reply) {
    Hoek.assert(request.params.theme, 'request.params.theme is required');

    const theme = request.params.theme.toLowerCase();

    selectData(theme)
      .then(toCsvReply(reply, `statewide_${theme}.csv`))
      .catch(handleApiError(reply));
  }

  getCountyCsv(request, reply) {
    Hoek.assert(request.params.theme, 'request.params.theme is required');
    Hoek.assert(request.params.countyName, 'request.params.countyName is required');

    const theme = request.params.theme.toLowerCase();
    const county = request.params.countyName.toUpperCase();

    selectData(theme, 'WugCounty', county)
      .then(toCsvReply(reply, `county_${county.toLowerCase()}_${theme}.csv`))
      .catch(handleApiError(reply));
  }

  getRegionCsv(request, reply) {
    Hoek.assert(request.params.theme, 'request.params.theme is required');
    Hoek.assert(request.params.regionLetter, 'request.params.regionLetter is required');

    const theme = request.params.theme.toLowerCase();
    const region = request.params.regionLetter.toUpperCase();

    selectData(theme, 'WugRegion', region)
      .then(toCsvReply(reply, `region_${region.toLowerCase()}_${theme}.csv`))
      .catch(handleApiError(reply));
  }

  getEntityCsv(request, reply) {
    Hoek.assert(request.params.theme, 'request.params.theme is required');
    Hoek.assert(request.params.entityId, 'request.params.entityId is required');

    const theme = request.params.theme.toLowerCase();
    const entityId = request.params.entityId;

    selectData(theme, 'EntityId', entityId)
      .then(toCsvReply(reply, `entity_${entityId}_${theme}.csv`))
      .catch(handleApiError(reply));
  }

  getUsageTypeCsv(request, reply) {
    Hoek.assert(request.params.theme, 'request.params.theme is required');
    Hoek.assert(request.params.usageType, 'request.params.usageType is required');

    const theme = request.params.theme.toLowerCase();
    const usageType = request.params.usageType.toUpperCase();

    selectData(theme, 'WugType', usageType)
      .then(toCsvReply(reply, `usagetype_${usageType.toLowerCase()}_${theme}.csv`))
      .catch(handleApiError(reply));
  }
}

export default DownloadController;