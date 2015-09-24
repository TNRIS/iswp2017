
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
  constructor({table, theme}) {
    Hoek.assert(theme, 'options.theme must be specified');
    Hoek.assert(table, 'options.table must be specified');

    this.theme = theme;
    this.table = table;
  }

  selectData(params) {
    const defaultValueArgs = R.map(renameValueColumn(this.theme))(constants.YEARS);

    const selectArgs = params.year ? R.append(renameValueColumn(this.theme)(params.year), commonSelectArgs)
      : R.concat(commonSelectArgs, defaultValueArgs);

    return db.select.apply(db, selectArgs)
      .from(this.table);
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