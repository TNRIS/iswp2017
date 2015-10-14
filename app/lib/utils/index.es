
import R from 'ramda';

import makeCommonDataRoutes from 'lib/utils/makeCommonDataRoutes';

export default {
  isEmptyObj(o) {
    if (!o) { return true; }
    return R.isEmpty(R.keys(o));
  },
  makeCommonDataRoutes
};