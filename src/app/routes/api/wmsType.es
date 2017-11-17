import Joi from 'joi';

import constants from 'lib/constants';
import WmsTypeController from 'controllers/wmsType';

const wmsTypeController = new WmsTypeController();
const bind = (method) => wmsTypeController[method].bind(wmsTypeController);

export default function generateRoutes(validParams) {
    const validWmsType = validParams.wmsType;

    return [
        {
            method: 'GET',
            path: '/wmstype/{WmsType}',
            config: {
                validate: {
                    params: {
                        WmsType: Joi.string().only(validWmsType).required()
                    }
                },
                cache: {
                    expiresIn: constants.API_CACHE_EXPIRES_IN
                },
                description: 'Get all WMS by type'
            },
            handler: bind('getByType')
        }
    ]
}