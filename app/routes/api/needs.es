
import utils from 'lib/utils';
import ThemeDataController from 'controllers/themeData';

const needsController = new ThemeDataController({
  theme: 'needs',
  table: 'vwMapWugNeeds'
});

export default utils.makeCommonDataRoutes(needsController);