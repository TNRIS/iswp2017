
import utils from 'lib/utils';
import ThemeDataController from 'controllers/themeData';

const demandsController = new ThemeDataController({
  theme: 'demands',
  dataTable: 'vwMapWugDemand',
  summaryTable: 'vwMapWugDemandsA1'
});

export default utils.makeCommonDataRoutes(demandsController);