import Hoek from 'hoek';

import db from 'db';
import {handleApiError} from 'lib/utils';

const wmsTypeTable = 'vw2017MapWMSProjectsByWMSType';


class WMSTypeController {
    getByType(request, reply) {
        Hoek.assert(request.params.WMSType, 'request.params.WMSType is required');
        console.log("Getting data...");

        const wmsType = request.params.WMSType;

        db.select().from(wmsTypeTable)
            .where('WMSType', wmsType)
            .then(reply)
            .catch(handleApiError(reply));
    }
}

export default WMSTypeController;
