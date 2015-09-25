import Joi from 'joi';

import utils from 'lib/utils';
import PlacesController from 'controllers/places';

const placesController = new PlacesController();

const routeConfigs = [
  {
    path: '/places/regions',
    query: {
      f: Joi.string().only(['geojson', 'topojson']).optional()
    },
    handler: 'getRegions'
  },
  {
    path: '/places/regions/{regionLetter}',
    params: {
      regionLetter: Joi.string().length(1).required()
    },
    handler: 'getRegion'
  },
  {
    path: '/places/regions/names',
    handler: 'getRegionLetters'
  },
  {
    path: '/places/counties',
    query: {
      f: Joi.string().only(['geojson', 'topojson']).optional()
    },
    handler: 'getCounties'
  },
  {
    path: '/places/counties/{countyName}',
    params: {
      countyName: Joi.string().required()
    },
    handler: 'getCounty'
  },
  {
    path: '/places/counties/names',
    handler: 'getCountyNames'
  }
];

export default utils.toHapiRoutes(routeConfigs, placesController);