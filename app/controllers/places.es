import R from 'ramda';
import Hoek from 'hoek';
import topojson from 'topojson';

import db from 'db';

function selectRegions() {
  return db.select('LETTER as Name', 'geojson').from('regions');
}

function selectCounties() {
  return db.select('COUNTY as Name', 'FIPS_NBR', 'geojson').from('counties');
}

function rowToFeature(row) {
  if (!row || !row.geojson) {
    return null;
  }
  const feature = JSON.parse(row.geojson);
  feature.properties = R.omit(['geojson'])(row);
  return feature;
}

function rowsToFeatureCollection(rows) {
  return R.reduce((fc, row) => {
    fc.features.push(rowToFeature(row));
    return fc;
  }, {type: 'FeatureCollection', features: []}, rows);
}

function toTopoJson(request) {
  return (fc) => {
    if (request.query.f === 'topojson') {
      return topojson.topology({collection: fc}, {
        'property-transform': (f) => f.properties
      });
    }
    return fc;
  };
}

class PlacesController {
  getRegions(request, reply) {
    const shouldTopo = request.query.f === 'topojson';
    selectRegions()
      .then(R.compose(reply,
        shouldTopo ? toTopoJson(request) : R.identity,
        rowsToFeatureCollection
      ));
  }

  getRegion(request, reply) {
    Hoek.assert(request.params.regionLetter, 'request.params.regionLetter is required');

    selectRegions()
      .where('LETTER', request.params.regionLetter.toUpperCase())
      .limit(1)
      .then(R.compose(reply, rowToFeature, R.nth(0)));
  }

  getRegionLetters(request, reply) {
    db.select('LETTER').from('regions').orderBy('LETTER')
      .then(R.compose(reply, R.pluck('LETTER')));
  }

  getCounties(request, reply) {
    const shouldTopo = request.query.f === 'topojson';
    selectCounties()
      .then(R.compose(reply,
        shouldTopo ? toTopoJson(request) : R.identity,
        rowsToFeatureCollection
      ));
  }

  getCounty(request, reply) {
    Hoek.assert(request.params.countyName, 'request.params.countyName is required');

    selectCounties()
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