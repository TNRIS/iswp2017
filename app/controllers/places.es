
import R from 'ramda';
import Hoek from 'hoek';

import db from 'db';
import {handleApiError} from 'lib/utils';

class PlacesController {
  getRegionsForCounty(request, reply) {
    Hoek.assert(request.params.county, 'request.params.county is required');

    const countyName = request.params.county.toUpperCase();

    db.select('RegionLetter').from('vw2017MapSelectRegionsInCounty')
      .where('CountyName', countyName)
      .orderBy('RegionLetter')
      .then(R.compose(reply, R.pluck(['RegionLetter'])))
      .catch(handleApiError(reply));
  }
}

export default PlacesController;