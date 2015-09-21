import R from 'ramda';

import demands from 'routes/api/demands';

export default R.reduce(R.concat, [], [demands]);
