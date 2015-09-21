
import R from 'ramda';
import Hoek from 'hoek';

import constants from 'lib/constants';

const commonSelectArgs = [
  'EntityId as EntityId', 'EntityName', 'WugType', 'WugRegion', 'WugCounty'
];

const renameValueColumn = (theme) => {
  return (year) => `${constants.VALUE_PREFIXES[theme]}${year} as Value_${year}`;
};

class BaseController {
  constructor(options) {
    Hoek.assert(options.theme, 'options.theme must be specified');

    this.theme = options.theme;
  }

  makeSelectArgs(params) {
    const defaultValueArgs = R.map(renameValueColumn(this.theme))(constants.YEARS);

    return params.year ? R.append(renameValueColumn(this.theme)(params.year), commonSelectArgs)
      : R.concat(commonSelectArgs, defaultValueArgs);
  }
}

export default BaseController;