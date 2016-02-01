
import utils from 'lib/utils';
import genDataRoutes from './data';
import genEntityRoutes from './entities';
import genPlacesRoutes from './places';

// TODO: Projects
// TODO: Sources

function addTo(server, basePath = '/') {
  const validParams = server.plugins.validParameters;
  if (!validParams) {
    throw new Error('validParameters must be loaded before adding api routes');
  }

  const dataRoutes = genDataRoutes(validParams);
  const entityRoutes = genEntityRoutes(validParams);
  const placesRoutes = genPlacesRoutes(validParams);

  utils.addRoutes(server, dataRoutes, basePath);
  utils.addRoutes(server, entityRoutes, basePath);
  utils.addRoutes(server, placesRoutes, basePath);

  server.route({
    method: 'GET',
    path: basePath,
    handler: {
      view: {
        template: 'api',
        context: {
          routeGroups: [
            {
              name: 'Data',
              description: 'Methods to retrieve raw and summary water planning data.',
              routes: dataRoutes
            },
            {
              name: 'Entities',
              description: 'Methods to retrieve entity (water user group) information.',
              routes: entityRoutes
            },
            {
              name: 'Places',
              description: 'Methods to retrieve places (regional water planning areas, counties, etc.) information.',
              routes: placesRoutes
            }
          ]
        }
      }
    }
  });
}

export default {
  addTo
};