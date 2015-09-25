import Hoek from 'hoek';

import db from 'db';

const entityTable = 'vwMapEntityCoordinates';
const entitySummaryTable = 'vwMapEntitySummary';

class EntitiesController {
  getAll(request, reply) {
    db.select('*').from(entityTable).orderBy('EntityId')
      .then(reply);
  }

  getByNamePartial(request, reply) {
    Hoek.assert(request.query.name, 'request.query.name is required');

    const nameQuery = '%' + request.query.name + '%';
    const startsWithName = request.query.name + '%';

    db.select('*').from(entityTable)
      .where('EntityName', 'like', nameQuery)
      .orderByRaw(`CASE WHEN EntityName LIKE "${startsWithName}" THEN 1 ELSE 2 END`)
      .limit(10)
      .then(reply);
  }

  getOne(request, reply) {
    Hoek.assert(request.params.entityId, 'request.params.entityId is required');

    db.select('*').from(entityTable)
      .where('EntityId', request.params.entityId)
      .limit(1)
      .then(reply);
  }

  getEntitySummary(request, reply) {
    Hoek.assert(request.params.entityId, 'request.params.entityId is required');

    db.select('*').from(entitySummaryTable)
      .where('EntityId', request.params.entityId)
      .limit(1)
      .then(reply);
  }

  //TODO: Some way to get the entities for a particular data view
  //Perhaps the data views should join with the entityCoordinatesTable
  //to do this
}

export default EntitiesController;