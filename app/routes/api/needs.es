
import utils from 'lib/utils';
import ThemeDataController from 'controllers/themeData';

const needsController = new ThemeDataController({
  theme: 'needs',
  dataTable: 'vwMapWugNeeds',
  summaryTable: 'vwMapWugNeedsA1'
});

export default utils.makeCommonDataRoutes(needsController);