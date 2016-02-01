
import R from 'ramda';
import Hoek from 'hoek';

import db from 'db';
import {handleApiError} from 'lib/utils';

class PlacesController {
  getRegionsForCounty(request, reply) {
    Hoek.assert(request.params.countyName, 'request.params.countyName is required');

    const countyName = request.params.countyName.toUpperCase();

    db.select('RegionLetter').from('vw2017MapSelectRegionsInCounty')
      .where('CountyName', countyName)
      .orderBy('RegionLetter')
      .then(R.compose(reply, R.pluck(['RegionLetter'])))
      .catch(handleApiError(reply));
  }
}

export default PlacesController;