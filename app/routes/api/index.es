import R from 'ramda';

import demands from 'routes/api/demands';
import needs from 'routes/api/needs';

export default R.reduce(R.concat, [], [demands, needs]);
