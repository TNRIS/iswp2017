
import utils from 'lib/utils';
import ThemeDataController from 'controllers/themeData';

const demandsController = new ThemeDataController({
  theme: 'demands',
  table: 'vwMapWugDemand'
});

export default utils.makeCommonDataRoutes(demandsController);