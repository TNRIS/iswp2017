
import R from 'ramda';
import Joi from 'joi';

import constants from 'lib/constants';
import DownloadController from 'controllers/download';
import utils from 'lib/utils';

const downloadController = new DownloadController();
const bind = (method) => downloadController[method].bind(downloadController);

function addTo(server, basePath = '/') {
  const themes = R.keys(constants.DATA_TABLES);
  const routes = [
    {
      method: 'GET',
      path: '/{theme}.csv',
      config: {
        validate: {
          params: {
            theme: Joi.string().only(themes).insensitive().required()
          }
        }
      },
      handler: bind('getThemeCsv')
    },
    {
      method: 'GET',
      path: '/entities.csv',
      handler: bind('getEntitiesCsv')
    },
  ];

  utils.addRoutes(server, routes, basePath);
}

export default {
  addTo
};