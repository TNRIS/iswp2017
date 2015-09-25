import R from 'ramda';
import Hoek from 'hoek';
import topojson from 'topojson';

import db from 'db';

const selectRegions = db.select('LETTER', 'geojson').from('regions');

const selectCounties = db.select('COUNTY', 'FIPS_NBR', 'geojson').from('counties');

const rowToFeature = (row) => {
  const feature = JSON.parse(row.geojson);
  feature.properties = R.omit(['geojson'])(row);
  return feature;
};

const rowsToFeatureCollection = R.reduce((fc, row) => {
  fc.features.push(rowToFeature(row));
  return fc;
}, {type: 'FeatureCollection', features: []});

class PlacesController {
  getRegions(request, reply) {
    //TODO: topojson if request.query.f === topojson
    selectRegions
      .then(R.compose(reply, rowsToFeatureCollection));
  }

  getRegion(request, reply) {
    Hoek.assert(request.params.regionLetter, 'request.params.regionLetter is required');

    selectRegions
      .where('LETTER', request.params.regionLetter.toUpperCase())
      .limit(1)
      .then(R.compose(reply, rowToFeature, R.nth(0)));
  }

  getRegionLetters(request, reply) {
    db.select('LETTER').from('regions').orderBy('LETTER')
      .then(R.compose(reply, R.pluck('LETTER')));
  }

  getCounties(request, reply) {
    //TODO: topojson if request.query.f === topojson
    selectCounties
      .then(R.compose(reply, rowsToFeatureCollection));
  }

  getCounty(request, reply) {
    Hoek.assert(request.params.countyName, 'request.params.countyName is required');

    selectCounties
      .where('COUNTY', request.params.countyName.toUpperCase())
      .limit(1)
      .then(R.compose(reply, rowToFeature, R.nth(0)));
  }

  getCountyNames(request, reply) {
    db.select('COUNTY').from('counties').orderBy('COUNTY')
      .then(R.compose(reply, R.pluck('COUNTY')));
  }
}

export default PlacesController;