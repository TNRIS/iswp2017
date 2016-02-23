
import R from 'ramda';
import Hoek from 'hoek';

import db from 'db';
import {handleApiError} from 'lib/utils';

class PlacesController {
  getRegionsForCounty(request, reply) {
    Hoek.assert(request.params.countyName, 'request.params.countyName is required');

    const countyName = request.params.countyName.toUpperCase();

    db.distinct('RegionLetter').from('vw2017MapSelectRegionsInCounty')
      .where('CountyName', countyName)
      .orderBy('RegionLetter')
      .then(R.compose(reply, R.pluck(['RegionLetter'])))
      .catch(handleApiError(reply));
  }

  getCountiesForEntity(request, reply) {
    Hoek.assert(request.params.entityId, 'request.params.entityId is required');

    db.distinct('WugCounty').from('vw2017MapSelectEntitiesInCounty')
      .where('EntityId', request.params.entityId)
      .orderBy('WugCounty')
      .then(R.compose(reply, R.pluck(['WugCounty'])))
      .catch(handleApiError(reply));
  }

  getRegionsForEntity(request, reply) {
    Hoek.assert(request.params.entityId, 'request.params.entityId is required');

    db.distinct('WugRegion').from('vw2017MapSelectEntitiesInRegion')
      .where('EntityId', request.params.entityId)
      .orderBy('WugRegion')
      .then(R.compose(reply, R.pluck(['WugRegion'])))
      .catch(handleApiError(reply));
  }
}

export default PlacesController;