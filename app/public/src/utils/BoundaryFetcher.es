
import xhr from 'xhr';
import R from 'ramda';
import topojson from 'topojson'; // TODO: remove once server-side api can return individual region features

import constants from '../constants';

export default {
  /**
  *
  * @param {String} type the type of boundary to fetch ('region' or 'county')
  * @param {String} id the id of the boundary (like a region name or county name)
  *
  */
  fetch: ({type, typeId}) => {
    return new Promise((resolve, reject) => {
      const uri = `//${constants.API_BASE}/places/`;

      xhr({
        json: true,
        uri: uri + (type === 'region' ? `regions.topojson`
          : `county/${typeId}.geojson`)
      }, (err, res, body) => {
        if (err) {
          reject(err);
        }
        else {
          if (type === 'region') {
            const regions = topojson.feature(body, body.objects.collection);
            const region = R.find(
              R.pathEq(['properties', 'region'], typeId.toUpperCase())
            )(regions.features);
            resolve(region);
          }
          resolve(body);
        }
      });
    });
  }
};
