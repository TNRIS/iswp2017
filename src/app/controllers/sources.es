
import Hoek from 'hoek';

import CdbUtil from '../public/src/utils/CdbUtil';
import {handleApiError} from 'lib/utils';

class SourcesController {
  getAll(request, reply) {
    CdbUtil.apiSources()
      .then(reply)
      .catch(handleApiError(reply));
  }

  getOne(request, reply) {
    Hoek.assert(request.params.sourceId, 'request.params.sourceId is required');

    CdbUtil.apiSources([request.params.sourceId])
      .then(reply)
      .catch(handleApiError(reply));
  }

  getByNamePartial(request, reply) {
    Hoek.assert(request.query.name, 'request.query.name is required');

    const nameQuery = '%25' + request.query.name + '%25';

    CdbUtil.apiNameSources(nameQuery)
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