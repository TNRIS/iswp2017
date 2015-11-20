import R from 'ramda';

import data from 'routes/api/data';
import entities from 'routes/api/entities';

// TODO: Population
// TODO: Projects
// TODO: Sources

export default R.reduce(R.concat, [], [
  data, entities
]);
