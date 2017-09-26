
import utils from 'lib/utils';
import genDataRoutes from './data';
import genEntityRoutes from './entities';
import genPlacesRoutes from './places';
import genSourceRoutes from './sources';
import genProjectRoutes from './projects';

/**
 * Add API routes
 * @param {object} server
 * @param {string} basePath 
 */
function addTo(server, basePath = '/') {
  const validParams = server.plugins.validParameters;
  if (!validParams) {
    throw new Error('validParameters must be loaded before adding api routes');
  }

  const dataRoutes = genDataRoutes(validParams);
  const entityRoutes = genEntityRoutes(validParams);
  const placesRoutes = genPlacesRoutes(validParams);
  const sourceRoutes = genSourceRoutes(validParams);
  const projectRoutes = genProjectRoutes(validParams);

  utils.addRoutes(server, dataRoutes, basePath);
  utils.addRoutes(server, entityRoutes, basePath);
  utils.addRoutes(server, placesRoutes, basePath);
  utils.addRoutes(server, sourceRoutes, basePath);
  utils.addRoutes(server, projectRoutes, basePath);

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
              description:
                'Methods to retrieve raw and summary water planning data.',
              routes: dataRoutes
            },
            {
              name: 'Entities',
              description:
                'Methods to retrieve entity (water user group) information.',
              routes: entityRoutes
            },
            {
              name: 'Places',
              description:
                'Methods to retrieve places (regional water planning areas, ' +
                'counties, etc.) information.',
              routes: placesRoutes
            },
            {
              name: 'Sources',
              description:
                'Methods to retrieve ground and surface water source ' +
                'information.',
              routes: sourceRoutes
            },
            {
              name: 'Projects',
              description:
                'Methods to retrieve water management strategies ' +
                'projects information.',
              routes: projectRoutes
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
