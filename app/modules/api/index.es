
import R from 'ramda';

import db from 'db';
import utils from 'lib/utils';
import genDataRoutes from './routes/data';
import genEntityRoutes from './routes/entities';

//Returns a Promise that resolves to an array of distinct values for 'prop' from 'table'
function distinctValues(prop, table) {
  return db.distinct(prop).orderBy(prop).from(table).then(R.pluck([prop]));
}

const apiModule = {
  register(server, options, next) {
    const basePath = '/api/v1';

    server.log(['info'], `Registering API module at ${basePath}`);

    const dbPromises = [];
    dbPromises.push(distinctValues('WugCounty', 'vw2017MapSelectEntitiesInCounty'));
    dbPromises.push(distinctValues('WugRegion', 'vw2017MapSelectEntitiesInRegion'));
    dbPromises.push(distinctValues('EntityId', 'vw2017MapEntityCoordinates'));

    Promise.all(dbPromises)
      .then(([counties, regions, entityIds]) => {
        // use the reshaped names and ids as validation parameters to routes
        // and add the routes to the server at basePath
        const dataRoutes = genDataRoutes(counties, regions, entityIds);
        const entityRoutes = genEntityRoutes(counties, regions, entityIds);
        utils.addRoutes(server, dataRoutes, basePath);
        utils.addRoutes(server, entityRoutes, basePath);
        next();
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  }
};


apiModule.register.attributes = {
  name: 'apiModule',
  version: '1.0.0'
};

export default apiModule;