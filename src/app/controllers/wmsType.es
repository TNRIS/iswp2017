import Hoek from 'hoek';

import db from 'db';
import {handleApiError} from 'lib/utils';

const wmsTypeTable = 'vw2017MapWMSProjectsByWmsType';


class WmsTypeController {
    getByType(request, reply) {
        Hoek.assert(request.params.WmsType, 'request.params.WmsType is required');

        const wmsType = request.params.WmsType;

        db.select().from(wmsTypeTable)
            .where('WmsType', wmsType)
            .then(reply)
            .catch(handleApiError(reply));
    }
}

export default WmsTypeController;
