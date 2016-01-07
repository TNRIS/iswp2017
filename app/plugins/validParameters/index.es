
import R from 'ramda';

import db from 'db';

//Returns a Promise that resolves to an array of distinct values for 'prop' from 'table'
function distinctValues(prop, table) {
  return db.distinct(prop).orderBy(prop).from(table).then(R.pluck([prop]));
}

const validParametersModule = {
  register(server, options, next) {
    const dbPromises = [];
    dbPromises.push(distinctValues('WugCounty', 'vw2017MapSelectEntitiesInCounty'));
    dbPromises.push(distinctValues('WugRegion', 'vw2017MapSelectEntitiesInRegion'));
    dbPromises.push(distinctValues('EntityId', 'vw2017MapEntityCoordinates'));

    Promise.all(dbPromises)
      .then(([counties, regions, entityIds]) => {
        // save the names and ids to the server object for use by route validation rules
        server.expose({
          counties,
          regions,
          entityIds
        });

        next();
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  }
};


validParametersModule.register.attributes = {
  name: 'validParameters'
};

export default validParametersModule;