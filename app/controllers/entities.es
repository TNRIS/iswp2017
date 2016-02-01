
import Hoek from 'hoek';

import db from 'db';
import {handleApiError} from 'lib/utils';

const entityTable = 'vw2017MapEntityCoordinates';
const entitiesInRegionTable = 'vw2017MapSelectEntitiesInRegion';
const entitiesInCountyTable = 'vw2017MapSelectEntitiesInCounty';

//TODO: this table does not exist yet
// const entitySummaryTable = 'vw2017MapEntitySummary';

class EntitiesController {
  getAll(request, reply) {
    db.select().from(entityTable).orderBy('EntityId')
      .then(reply)
      .catch(handleApiError(reply));
  }

  getByNamePartial(request, reply) {
    Hoek.assert(request.query.name, 'request.query.name is required');

    const nameQuery = '%' + request.query.name + '%';
    const startsWithName = request.query.name + '%';

    db.select().from(entityTable)
      .where('EntityName', 'like', nameQuery)
      .orderByRaw(`CASE WHEN EntityName LIKE "${startsWithName}" THEN 1 ELSE 2 END`)
      .limit(255)
      .then(reply)
      .catch(handleApiError(reply));
  }

  getOne(request, reply) {
    Hoek.assert(request.params.entityId, 'request.params.entityId is required');

    db.select().from(entityTable)
      .where('EntityId', request.params.entityId)
      .limit(1)
      .then(reply)
      .catch(handleApiError(reply));
  }

  //TODO: Summary table does not exist yet
  // getEntitySummary(request, reply) {
  //   //TODO: maybe also require year
  //   //TODO: maybe rename fields to Demands, Needs, Supply, StrategySupply
  //   Hoek.assert(request.params.entityId, 'request.params.entityId is required');

  //   db.select().from(entitySummaryTable)
  //     .where('EntityId', request.params.entityId)
  //     .limit(1)
  //     .then(reply)
  //     .catch(handleApiError(reply));
  // }

  getInRegion(request, reply) {
    Hoek.assert(request.params.regionLetter, 'request.params.regionLetter is required');

    const entityFields = [`${entityTable}.EntityId`, `${entityTable}.EntityName`,
      `${entityTable}.Latitude`, `${entityTable}.Longitude`, `${entityTable}.EntityTypeName`,
      `${entityTable}.EntityIsSplit`];

    db.select(entityFields).from(entitiesInRegionTable)
      .join(entityTable, `${entityTable}.EntityId`, `${entitiesInRegionTable}.EntityId`)
      .where('WugRegion', request.params.regionLetter.toUpperCase())
      .then(reply)
      .catch(handleApiError(reply));
  }

  getInCounty(request, reply) {
    Hoek.assert(request.params.countyName, 'request.params.countyName is required');

    const entityFields = [`${entityTable}.EntityId`, `${entityTable}.EntityName`,
      `${entityTable}.Latitude`, `${entityTable}.Longitude`, `${entityTable}.EntityTypeName`,
      `${entityTable}.EntityIsSplit`];

    db.select(entityFields).from(entitiesInCountyTable)
      .join(entityTable, `${entityTable}.EntityId`, `${entitiesInCountyTable}.EntityId`)
      .where('WugCounty', request.params.countyName.toUpperCase())
      .then(reply)
      .catch(handleApiError(reply));
  }
}

export default EntitiesController;