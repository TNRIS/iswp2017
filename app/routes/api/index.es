import R from 'ramda';

import entities from 'routes/api/entities';
import demands from 'routes/api/demands';
import needs from 'routes/api/needs';
import supplies from 'routes/api/supplies';
import strategies from 'routes/api/strategies';


// TODO: Places
// TODO: Entities
// TODO: Population
// TODO: Projects
// TODO: Sources

export default R.reduce(R.concat, [], [
  entities, demands, needs, supplies, strategies
]);
