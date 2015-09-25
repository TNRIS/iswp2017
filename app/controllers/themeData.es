import R from 'ramda';
import Hoek from 'hoek';

import db from 'db';
import constants from 'lib/constants';

const entityTable = 'vwMapEntityCoordinates';


const renameValueColumn = (theme) => {
  return (year) => `${constants.VALUE_PREFIXES[theme]}${year} as Value_${year}`;
};

class ThemeDataController {
  constructor({theme, dataTable, summaryTable}) {
    Hoek.assert(theme, 'options.theme must be specified');
    Hoek.assert(dataTable, 'options.dataTable must be specified');
    Hoek.assert(summaryTable, 'options.summaryTable must be specified');

    this.theme = theme;
    this.dataTable = dataTable;
    this.summaryTable = summaryTable;

    this.commonSelectArgs = [
      `${dataTable}.EntityId as EntityId`, `${dataTable}.EntityName`, `${dataTable}.WugType`,
      `${dataTable}.WugRegion`, `${dataTable}.WugCounty`,
      `${entityTable}.Latitude`, `${entityTable}.Longitude`, `${entityTable}.entityType`
    ];
  }

  getSummary(request, reply) {
    db.select('REGION as WugRegion', 'MUNICIPAL', 'IRRIGATION',
      'MANUFACTURING', 'MINING', 'STEAM-ELECTRIC as STEAMELECTRIC', 'LIVESTOCK',
      'TOTAL')
      .from(this.summaryTable)
      .where('DECADE', request.params.year)
      .orderBy('WugRegion')
      .then(reply);
  }

  selectData(params) {
    const defaultValueArgs = R.map(renameValueColumn(this.theme))(constants.YEARS);

    const selectArgs = params.year ? R.append(renameValueColumn(this.theme)(params.year), this.commonSelectArgs)
      : R.concat(this.commonSelectArgs, defaultValueArgs);

    return db.select(selectArgs)
      .from(this.dataTable)
      .join(entityTable, `${entityTable}.EntityId`, `${this.dataTable}.EntityId`);
  }

  getAll(request, reply) {
    this.selectData(request.params)
      .then(reply);
  }

  getForRegion(request, reply) {
    Hoek.assert(request.params.year, 'request.params.year is required');
    Hoek.assert(request.params.regionLetter, 'request.params.regionLetter is required');

    this.selectData(request.params)
      .where('WugRegion', request.params.regionLetter.toUpperCase())
      .then(reply);
  }

  getForCounty(request, reply) {
    Hoek.assert(request.params.year, 'request.params.year is required');
    Hoek.assert(request.params.county, 'request.params.county is required');

    this.selectData(request.params)
      .where('WugCounty', request.params.county.toUpperCase())
      .then(reply);
  }

  getForType(request, reply) {
    Hoek.assert(request.params.year, 'request.params.year is required');
    Hoek.assert(request.params.type, 'request.params.type is required');

    this.selectData(request.params)
      .where('WugType', request.params.type.toUpperCase())
      .then(reply);
  }

  getForEntity(request, reply) {
    Hoek.assert(request.params.year, 'request.params.year is required');
    Hoek.assert(request.params.entityId, 'request.params.entityId is required');

    this.selectData(request.params)
      .where(`${this.dataTable}.EntityId`, request.params.entityId)
      .then(reply);
  }
}

export default ThemeDataController;