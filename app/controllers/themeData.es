
import R from 'ramda';
import Hoek from 'hoek';

import db from 'db';
import constants from 'lib/constants';

const commonSelectArgs = [
  'EntityId as EntityId', 'EntityName', 'WugType', 'WugRegion', 'WugCounty'
];

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

    const selectArgs = params.year ? R.append(renameValueColumn(this.theme)(params.year), commonSelectArgs)
      : R.concat(commonSelectArgs, defaultValueArgs);

    return db.select(selectArgs)
      .from(this.dataTable);
  }

  getAll(request, reply) {
    this.selectData(request.params)
      .then(reply);
  }

  getForRegion(request, reply) {
    this.selectData(request.params)
      .where('WugRegion', request.params.regionLetter.toUpperCase())
      .then(reply);
  }

  getForCounty(request, reply) {
    this.selectData(request.params)
      .where('WugCounty', request.params.county.toUpperCase())
      .then((results) => {
        reply(results);
      });
  }

  getForType(request, reply) {
    this.selectData(request.params)
      .where('WugType', request.params.type.toUpperCase())
      .then((results) => {
        reply(results);
      });
  }

  getForEntity(request, reply) {
    this.selectData(request.params)
      .where('EntityId', request.params.entityId)
      .then((results) => {
        reply(results);
      });
  }
}

export default ThemeDataController;