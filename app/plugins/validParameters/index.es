
import R from 'ramda';

import db from 'db';

import {sourceNames} from '../../public/src/utils/SourceNames';

/**
 * Returns a Promise that resolves to an array of distinct values 
 * for 'prop' from 'table'
 * @param {string} prop - the property to query
 * @param {string} table - the table to query
 * @return {array} distinct values for that property
 */
function distinctValues(prop, table) {
  return db.distinct(prop).orderBy(prop).from(table).then(R.pluck([prop]));
}

/**
 * Returns an array of distinct sources
 * @return {array} - distinct data sources?
 */
function distinctSources() {
  const sourceid = (x) => x['sourceid'];
  const diff = (a, b) => a - b;
  return R.sort(diff, R.map(sourceid, sourceNames));
}

const validParametersModule = {
  register: (server, options, next) => {
    const dbPromises = [];
    dbPromises.push(
      distinctValues('WugCounty', 'vw2017MapSelectEntitiesInCounty'));
    dbPromises.push(
      distinctValues('WugRegion', 'vw2017MapSelectEntitiesInRegion'));
    dbPromises.push(distinctValues('EntityId', 'vw2017MapEntityCoordinates'));
    dbPromises.push(distinctValues('WugType', 'vw2017MapWugDemand'));
    dbPromises.push(distinctValues('WMSProjectId', 'vw2017MapWMSProjects'));
    dbPromises.push(distinctValues('WMSId', 'vw2017MapWMSWugSupply'));
    dbPromises.push(distinctSources());

    Promise.all(dbPromises)
      .then(([counties, regions, entityIds, usageTypes, projects, sources, wms]) => {
        // save the names and ids to the server object for 
        // use by route validation rules
        server.expose({
          counties,
          regions,
          entityIds,
          usageTypes,
          projects,
          sources,
          wms
        });

        next();
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  },
};


validParametersModule.register.attributes = {
  name: 'validParameters',
  version: '1.0.0',
};

export default validParametersModule;
