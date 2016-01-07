
import utils from 'lib/utils';
import genDataRoutes from './data';
import genEntityRoutes from './entities';

// TODO: Population
// TODO: Projects
// TODO: Sources

function add(server, basePath = '/') {
  const validParams = server.plugins.validParameters;
  if (!validParams) {
    throw new Error('validParameters must be loaded before adding api routes');
  }

  const dataRoutes = genDataRoutes(validParams.counties,
    validParams.regions, validParams.entityIds);
  const entityRoutes = genEntityRoutes(validParams.counties,
    validParams.regions, validParams.entityIds);

  utils.addRoutes(server, dataRoutes, basePath);
  utils.addRoutes(server, entityRoutes, basePath);
}

export default {
  add
};