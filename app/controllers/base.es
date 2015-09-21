
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

class BaseController {
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
}

export default BaseController;