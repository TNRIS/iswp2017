
import Hoek from 'hoek';

import db from 'db';
import {handleApiError} from 'lib/utils';

const wmsTable = 'vw2017MapWMSWugSupply';

//TODO: this table does not exist yet
// const entitySummaryTable = 'vw2017MapEntitySummary';

class WMSController {
  getAll(request, reply) {
    db.select().from(wmsTable).orderBy('WmsId')
      .then(reply)
      .catch(handleApiError(reply));
  }

  getByNamePartial(request, reply) {
    Hoek.assert(request.query.name, 'request.query.name is required');

    const nameQuery = '%' + request.query.name + '%';
    const startsWithName = request.query.name + '%';

    db.select().from(wmsTable)
      .where('WmsName', 'like', nameQuery)
      .orderByRaw(`CASE WHEN WmsName LIKE "${startsWithName}" THEN 1 ELSE 2 END`)
      .limit(255)
      .then(reply)
      .catch(handleApiError(reply));
  }

  getOne(request, reply) {
    Hoek.assert(request.params.WmsId, 'request.params.WmsId is required');

    db.select().from(wmsTable)
      .where('WmsId', request.params.WmsId)
      .limit(1)
      .then(reply)
      .catch(handleApiError(reply));
  }
}

export default WMSController;
