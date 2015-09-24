import R from 'ramda';

import demands from 'routes/api/demands';
import needs from 'routes/api/needs';
import supplies from 'routes/api/supplies';

// TODO: Places
// TODO: Entities
// TODO: Population
// TODO: Existing Supplies
// TODO: Recommended Strategies
// TODO: Projects
// TODO: Sources

export default R.reduce(R.concat, [], [demands, needs, supplies]);
