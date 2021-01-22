
import Hoek from 'hoek';

import CdbUtil from '../public/src/utils/CdbUtil';
import {handleApiError} from 'lib/utils';

class SourcesController {
  getAll(request, reply) {
    CdbUtil.apiSources()
      .then((reply) => {
        const sids = [];
        const rows = [];
        reply.features.map(f => {
          if (!sids.includes(f.properties.sourceid)) {
            rows.push(f.properties);
            sids.push(f.properties.sourceid);
          }
        });
        const formatted = {
          "rows": rows,
          "total_rows": rows.length
        }
        return formatted;
      })
      .then(reply)
      .catch(handleApiError(reply));
  }

  getOne(request, reply) {
    Hoek.assert(request.params.sourceId, 'request.params.sourceId is required');
    CdbUtil.apiSources([request.params.sourceId])
      .then((reply) => {
        const rows = [reply.features[0].properties];
        const formatted =  {
          "rows": rows,
          "total_rows": rows.length
        };
        return formatted;
      })
      .then(reply)
      .catch(handleApiError(reply));
  }

  getByNamePartial(request, reply) {
    Hoek.assert(request.query.name, 'request.query.name is required');

    const nameQuery = '*' + request.query.name.toUpperCase() + '*';

    CdbUtil.apiNameSources(nameQuery)
      .then((reply) => {
        const sids = [];
        const rows = [];
        reply.features.map(f => {
          if (!sids.includes(f.properties.sourceid)) {
            rows.push(f.properties);
            sids.push(f.properties.sourceid);
          }
        });
        const formatted = {
          "rows": rows,
          "total_rows": rows.length
        }
        return formatted;
      })
      .then(reply)
      .catch(handleApiError(reply));
  }

  getAllGeoJson(request, reply) {
    CdbUtil.apiGeoJsonSources()
      .then(reply)
      .catch(handleApiError(reply));
  }

  getOneGeoJson(request, reply) {
    Hoek.assert(request.params.sourceId, 'request.params.sourceId is required');

    CdbUtil.apiGeoJsonSources([request.params.sourceId])
      .then(reply)
      .catch(handleApiError(reply));
  }
}

export default SourcesController;