import R from 'ramda';

import entities from 'routes/api/entities';
import places from 'routes/api/places';
import demands from 'routes/api/demands';
import needs from 'routes/api/needs';
import supplies from 'routes/api/supplies';
import strategies from 'routes/api/strategies';

// TODO: Population
// TODO: Projects
// TODO: Sources

export default R.reduce(R.concat, [], [
  entities, places, demands, needs, supplies, strategies
]);
