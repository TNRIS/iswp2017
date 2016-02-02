
import R from 'ramda';
import Hoek from 'hoek';
import Papa from 'papaparse';

import db from 'db';
import constants from 'lib/constants';
import {handleApiError} from 'lib/utils';

//make a unary version of Papa.unparse
const unparse = R.unary(Papa.unparse);

const entityTable = 'vw2017MapEntityCoordinates';

function toCsvReply(reply, filename = 'data.csv') {
  return (data) => {
    return reply(data)
      .type('text/csv')
      .header('content-disposition', `attachment; filename=${filename}`);
  };
}

class DownloadController {
  getThemeCsv(request, reply) {
    Hoek.assert(request.params.theme, 'request.params.theme is required');

    const theme = request.params.theme.toLowerCase();
    const table = constants.DATA_TABLES[theme];

    db.select().from(table).orderBy('EntityId')
      .then(R.compose(toCsvReply(reply, `${theme}.csv`), unparse))
      .catch(handleApiError(reply));
  }

  getEntitiesCsv(request, reply) {
    db.select().from(entityTable).orderBy('EntityId')
      .then(R.compose(toCsvReply(reply, 'entities.csv'), unparse))
      .catch(handleApiError(reply));
  }
}

export default DownloadController;